// Classes de personagem. O ícone é uma arte em pixel 10x10: cada item é um retângulo colorido.
const px = (x, y, w, h, fill) => ({ x, y, w, h, fill });

export const CLASSES = [
  {
    name: "Guerreiro",
    description: "Mais HP, ideal para rotinas puxadas",
    icon: [px(8, 0, 2, 1, "#9aa3ad"), px(7, 1, 2, 1, "#9aa3ad"), px(6, 2, 2, 1, "#9aa3ad"), px(5, 3, 2, 1, "#9aa3ad"), px(4, 4, 2, 1, "#9aa3ad"), px(1, 5, 1, 1, "#e9c46a"), px(3, 5, 2, 1, "#9aa3ad"), px(2, 6, 2, 1, "#e9c46a"), px(1, 7, 2, 1, "#8a5f2c"), px(3, 7, 1, 1, "#e9c46a"), px(0, 8, 2, 1, "#8a5f2c"), px(0, 9, 1, 1, "#8a5f2c")],
  },
  {
    name: "Mago",
    description: "Mais XP em missões de estudo",
    icon: [px(6, 0, 3, 1, "#c58be0"), px(5, 1, 1, 1, "#c58be0"), px(6, 1, 3, 2, "#b48ae0"), px(9, 1, 1, 2, "#c58be0"), px(6, 3, 3, 1, "#c58be0"), px(5, 4, 1, 1, "#8a5f2c"), px(4, 5, 1, 1, "#8a5f2c"), px(3, 6, 1, 1, "#8a5f2c"), px(2, 7, 1, 1, "#8a5f2c"), px(1, 8, 1, 1, "#8a5f2c"), px(0, 9, 1, 1, "#8a5f2c")],
  },
  {
    name: "Ladino",
    description: "Mais ouro por missão concluída",
    icon: [px(2, 0, 2, 1, "#8a5f2c"), px(4, 1, 1, 1, "#8a5f2c"), px(5, 2, 1, 2, "#8a5f2c"), px(6, 4, 1, 2, "#8a5f2c"), px(5, 6, 1, 2, "#8a5f2c"), px(4, 8, 1, 1, "#8a5f2c"), px(2, 9, 2, 1, "#8a5f2c"), px(2, 1, 1, 8, "#9aa3ad"), px(0, 5, 9, 1, "#7cc47a"), px(9, 4, 1, 3, "#7cc47a")],
  },
];
