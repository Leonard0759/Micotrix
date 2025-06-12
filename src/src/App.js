import React from "react";
import { Client } from "boardgame.io/react";
import { Micotrix } from "./game/GameLogic";
import Board from "./components/Board";

const App = () => {
  return (
    <div>
      <h1>Micotrix: Corrida Fúngica de Cartas</h1>
      <Client
        game={Micotrix}
        board={Board}
        numPlayers={2}
        debug
      />
      <p>
        Compartilhe este site com seus amigos para jogar juntos!
      </p>
    </div>
  );
};

export default App;
