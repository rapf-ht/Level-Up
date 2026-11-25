package com.levelup.api.entities;

import com.levelup.api.enums.ItemType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Long idItem;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "icon", length = 255)
    private String icon;

    @Column(name = "gc_price", nullable = false)
    private Integer gcPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private ItemType itemType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_quest")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Quest quest;

    @Transient
    public int getSellPrice() {
        return gcPrice == null ? 0 : gcPrice / 2;
    }
}
