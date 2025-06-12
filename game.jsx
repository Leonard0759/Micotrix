import { useEffect, useState } from "react";
import { Card } from "./Card";

const generateDeck = () => {
  const fungi = ["Aspergillus", "Candida", "Cryptococcus", "Histoplasma"];
  const deck = [];

  fungi.forEach((fungus) => {
    for (let i = 0; i <= 9; i++) {
      deck.push({ number: i, fungus, color: fungus });
      deck.push({ number: i, fungus, color: fungus });
    }
  });

  return shuffle(deck);
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function Game({ playerName, roomCode }) {
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);

  useEffect(() => {
    const newDeck = generateDeck();
    const initialHand = newDeck.slice(0, 7);
    const topCard = newDeck[7];
    setHand(initialHand);
    setDiscardPile([topCard]);
    setDeck(newDeck.slice(8));
  }, []);

  const playCard = (cardIndex) => {
    const cardToPlay = hand[cardIndex];
    const topCard = discardPile[discardPile.length - 1];

    // Regra: jogar se cor ou número coincidem
    if (
      cardToPlay.number === topCard.number ||
      cardToPlay.color === topCard.color
    ) {
      setDiscardPile([...discardPile, cardToPlay]);
      setHand(hand.filter((_, i) => i !== cardIndex));
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-2">Sala: {roomCode}</h2>
      <h3 className="text-lg mb-4">Jogador: {playerName}</h3>

      <div className="mb-6">
        <h4 className="text-md font-semibold mb-2">Carta do topo:</h4>
        {discardPile.length > 0 && (
          <Card
            number={discardPile[discardPile.length - 1].number}
            fungus={discardPile[discardPile.length - 1].fungus}
            color={discardPile[discardPile.length - 1].color}
          />
        )}
      </div>

      <div className="mb-2 text-md font-semibold">Sua mão:</div>
      <div className="grid grid-cols-3 gap-2">
        {hand.map((card, index) => (
          <div key={index} onClick={() => playCard(index)} className="cursor-pointer">
            <Card number={card.number} fungus={card.fungus} color={card.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
