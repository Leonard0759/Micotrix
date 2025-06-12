import React, { useState } from "react";
import "./index.css";

// Definições das cartas e jogadores (adaptado de tipos.ts)
const cores = ["vermelho", "azul", "verde", "amarelo"];
const tiposEspeciais = [
  { value: "+2", type: "compra2" },
  { value: "↺", type: "reverter" },
  { value: "⏭", type: "pular" }
];

function criarBaralho() {
  let baralho = [];
  for (let cor of cores) {
    for (let n = 0; n <= 9; n++) {
      baralho.push({ color: cor, value: String(n), type: "normal" });
      if (n !== 0) baralho.push({ color: cor, value: String(n), type: "normal" });
    }
    for (let e of tiposEspeciais) {
      baralho.push({ color: cor, ...e });
      baralho.push({ color: cor, ...e });
    }
  }
  for (let i = 0; i < 4; i++) {
    baralho.push({ color: "coringa", value: "Coringa", type: "coringa" });
    baralho.push({ color: "coringa", value: "+4", type: "compra4" });
  }
  return embaralhar(baralho);
}

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function podeJogar(carta, topo, corAtiva) {
  return (
    carta.color === topo.color ||
    carta.value === topo.value ||
    carta.color === "coringa" ||
    (carta.color === corAtiva && carta.color !== "coringa")
  );
}

function proximoJogador(atual, total, direcao) {
  return (atual + direcao + total) % total;
}

export default function Aplicativo() {
  const [jogadores, setJogadores] = useState([
    { name: "Jogador 1", hand: [] },
    { name: "Jogador 2", hand: [] }
  ]);
  const [baralho, setBaralho] = useState(criarBaralho());
  const [descarte, setDescarte] = useState([]);
  const [atual, setAtual] = useState(0);
  const [direcao, setDirecao] = useState(1);
  const [corAtiva, setCorAtiva] = useState(null);
  const [comprar, setComprar] = useState(0);
  const [vencedor, setVencedor] = useState(null);
  const [escolherCor, setEscolherCor] = useState(false);

  React.useEffect(() => {
    if (descarte.length === 0) {
      let topo = baralho.find(c => c.color !== "coringa");
      setBaralho(b => b.filter((c, i) => i !== b.indexOf(topo)));
      setDescarte([topo]);
      setCorAtiva(topo.color);
      // Distribui cartas
      setJogadores(js =>
        js.map(j => ({
          ...j,
          hand: baralho.splice(0, 7)
        }))
      );
    }
    // eslint-disable-next-line
  }, []);

  function jogarCarta(carta, idx) {
    if (vencedor || jogadores[atual].hand[idx] !== carta) return;
    const topo = descarte[0];
    if (!podeJogar(carta, topo, corAtiva || carta.color)) return;
    const novosJogadores = jogadores.map((j, i) =>
      i === atual
        ? { ...j, hand: j.hand.filter((_, ii) => ii !== idx) }
        : j
    );
    setJogadores(novosJogadores);
    setDescarte([carta, ...descarte]);
    let novaCor = carta.color === "coringa" ? corAtiva : carta.color;
    if (novosJogadores[atual].hand.length === 0) {
      setVencedor(novosJogadores[atual].name);
      return;
    }
    let prox = atual;
    let novaDirecao = direcao;
    let novoComprar = comprar;

    switch (carta.type) {
      case "compra2":
        novoComprar += 2;
        break;
      case "compra4":
        novoComprar += 4;
        setEscolherCor(true);
        return;
      case "coringa":
        setEscolherCor(true);
        return;
      case "reverter":
        novaDirecao *= -1;
        break;
      case "pular":
        prox = proximoJogador(atual, jogadores.length, novaDirecao);
        break;
      default:
        break;
    }
    prox = proximoJogador(prox, jogadores.length, novaDirecao);
    setAtual(prox);
    setDirecao(novaDirecao);
    setComprar(novoComprar);
    setCorAtiva(novaCor);
  }

  function comprarCarta() {
    if (vencedor) return;
    const novosJogadores = [...jogadores];
    const qtde = Math.max(1, comprar);
    novosJogadores[atual].hand = [
      ...novosJogadores[atual].hand,
      ...baralho.slice(0, qtde)
    ];
    setJogadores(novosJogadores);
    setBaralho(baralho.slice(qtde));
    setComprar(0);
    setAtual(proximoJogador(atual, jogadores.length, direcao));
  }

  function escolherNovaCor(cor) {
    setCorAtiva(cor);
    setEscolherCor(false);
    setAtual(proximoJogador(atual, jogadores.length, direcao));
  }

  function reiniciar() {
    window.location.reload();
  }

  function renderizaMao(j, idx) {
    return (
      <div className={"mao" + (idx === atual ? " ativa" : "")}>
        <div className="titulo-jogador">
          {j.name}
          {idx === atual && " ← Sua vez"}
        </div>
        <div className="cartas">
          {j.hand.map((c, i) => (
            <button
              key={i}
              className={"carta " + c.color}
              disabled={
                vencedor ||
                idx !== atual ||
                !podeJogar(c, descarte[0], corAtiva || c.color)
              }
              onClick={() => jogarCarta(c, i)}
            >
              <span className="valor-carta">{c.value}</span>
              <span className="tipo-carta">{c.type !== "normal" ? c.type : ""}</span>
              <span className="cor-carta">{c.color}</span>
            </button>
          ))}
        </div>
        {idx === atual && (
          <button className="comprar" onClick={comprarCarta} disabled={vencedor}>
            Comprar {comprar > 0 ? comprar : 1}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="micotrix">
      <h1>Micotrix (Jogo tipo UNO)</h1>
      <div className="jogadores">
        {jogadores.map((j, i) => (
          <div key={i}>{renderizaMao(j, i)}</div>
        ))}
      </div>
      <div className="mesa">
        <div className="topo-monte">
          <div className={"carta " + (descarte[0]?.color || "")}>
            <span className="valor-carta">{descarte[0]?.value}</span>
            <span className="tipo-carta">{descarte[0]?.type !== "normal" ? descarte[0]?.type : ""}</span>
          </div>
          <div className="label">Topo do Monte</div>
        </div>
        <div className="baralho-restante">
          Restam <b>{baralho.length}</b> cartas no baralho
        </div>
        <div className="turno-info">
          Cor ativa: <b>{corAtiva}</b>
        </div>
      </div>
      {escolherCor && (
        <div className="escolher-cor">
          <div>Escolha uma cor:</div>
          {cores.map(c => (
            <button key={c} className={"carta " + c} onClick={() => escolherNovaCor(c)}>
              {c}
            </button>
          ))}
        </div>
      )}
      {vencedor && (
        <div className="vencedor">
          <h2>{vencedor} venceu!</h2>
          <button onClick={reiniciar}>Jogar novamente</button>
        </div>
      )}
      <footer>
        <small>
          Feito por Copilot para Leonard0759. Regras simplificadas. <br />
          Jogue em amigos revezando a vez!
        </small>
      </footer>
    </div>
  );
}
