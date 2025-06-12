export const Micotrix = {
  name: "micotrix",
  setup: () => ({
    players: [
      { name: "Jogador 1", position: 0, hand: [1, 2] },
      { name: "Jogador 2", position: 0, hand: [1, 2] },
    ],
    deck: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  }),
  moves: {
    drawCard(G, ctx) {
      const player = G.players[ctx.currentPlayer];
      if (G.deck.length > 0) {
        const card = G.deck.pop();
        player.hand.push(card);
      }
    },
    playCard(G, ctx, cardIndex) {
      const player = G.players[ctx.currentPlayer];
      if (player.hand.length > cardIndex) {
        player.position += player.hand[cardIndex];
        player.hand.splice(cardIndex, 1);
      }
    },
  },
  turn: {
    order: {
      first: () => 0,
      next: (G, ctx) => (ctx.currentPlayer + 1) % G.players.length,
    },
  },
  endIf: (G) => {
    const winner = G.players.find((p) => p.position >= 20);
    if (winner) {
      return { winner: winner.name };
    }
  },
};
