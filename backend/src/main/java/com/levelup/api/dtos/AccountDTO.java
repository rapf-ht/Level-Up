package com.levelup.api.dtos;

import com.levelup.api.entities.Account;

public class AccountDTO {
    public Long idAccount;
    public String user;
    public String email;
    // SEM SENHA, LGPD - RESPONSABILIDADE COM O USUÁRIO
    public String classPlayer;
    public Integer level;
    public Integer xp;
    public Integer hp;
    public Integer gc;

    public void AccountGetters (Account account) {
        this.idAccount = account.getIdAccount();
        this.user = account.getUser();
        this.email = account.getEmail();
        this.classPlayer = account.getClass().toString(); //Wrapper para String
        this.level = account.getLevel();
        this.xp = account.getXp();
        this.hp = account.getHp();
        this.gc = account.getGc();
    }
}
