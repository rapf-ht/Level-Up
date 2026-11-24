package com.levelup.api.dtos;

import com.levelup.api.enums.ClassPlayer;
import jakarta.validation.constraints.Size;

public record UpdateAccountDTO(
        @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres.")
        String username,

        ClassPlayer classPlayer
) {
}
