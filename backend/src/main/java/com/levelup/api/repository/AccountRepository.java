package com.levelup.api.repository;

import com.levelup.api.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

public class AccountRepository {
    @Repository
    public interface AccountRepositoryInterface extends JpaRepository<Account, Long> {
        Optional<Account> findByEmail(String email);
        Boolean existsByEmail(String email);
    }
}