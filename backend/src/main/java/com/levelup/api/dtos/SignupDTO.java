package com.levelup.api.dtos;

import com.levelup.api.enums.ClassPlayer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupDTO(
        @NotBlank(message = "Username é obrigatório.")
        @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres.")
        String username,

        @NotBlank(message = "Email é obrigatório.")
        @Email(message = "Formato de email inválido.")
        @Size(max = 255, message = "Email deve ter no máximo 255 caracteres.")
        String email,

        @NotBlank(message = "Senha é obrigatória.")
        @Size(min = 8, max = 100, message = "A senha deve ter no mínimo 8 caracteres.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z]).+$",
                message = "A senha deve conter letras maiúsculas e minúsculas."
        )
        String password,

        @NotNull(message = "Classe do personagem é obrigatória.")
        ClassPlayer classPlayer
) {
}
