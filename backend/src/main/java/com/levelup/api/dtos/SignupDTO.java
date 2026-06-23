package com.levelup.api.dtos;

public class SignupDTO {
    //Serve apenas para receber os dados do front-end na hora de criar a conta
    public String username;
    public String email;
    public String password;
    public String classPlayer; // String convertido para Enum depois
}
