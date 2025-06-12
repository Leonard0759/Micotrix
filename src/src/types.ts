export type CardColor = "vermelho" | "azul" | "verde" | "amarelo" | "coringa";
export type CardType = "normal" | "compra2" | "reverter" | "pular" | "coringa" | "compra4";

export interface Card {
  color: CardColor;
  value: string;
  type: CardType;
}

export interface Player {
  name: string;
  hand: Card[];
}
