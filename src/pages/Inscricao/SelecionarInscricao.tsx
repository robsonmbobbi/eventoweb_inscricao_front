/* import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "@mui/material";
import type { EventoListagem } from "../../interfaces/interfaces";

export default function SelecionarInscricao() {
  const location = useLocation();
  const navigate = useNavigate();
  const evento: EventoListagem | undefined = location.state?.evento;

  // Inicializa com string vazia, sempre chamado na mesma ordem
  const [tipoInscricaoEscolhida, setTipoInscricaoEscolhida] =
    useState<string>("");

  // Ajusta o estado baseado no evento assim que ele estiver disponível
  useEffect(() => {
    if (evento && !evento.permiteInscricaoInfantil) {
      setTipoInscricaoEscolhida(`Participante e/ou trabalhador`);
    }
  }, [evento]);

  if (!evento) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg">Evento não encontrado!</p>
      </div>
    );
  }

  const tiposInscricao = [
    `Infantil (menores de ${evento.idadeMinima})`,
    "Participante e/ou trabalhador",
  ];

  const clicarContinuar = () => {
    if (evento.permiteInscricaoInfantil && !tipoInscricaoEscolhida) {
      alert(
        "VOCÊ NÃO ESCOLHEU O TIPO DE INSCRIÇÃO QUE DESEJA FAZER! Escolha um tipo de inscrição para podermos continuar!!"
      );
      return;
    }

    if (
      !evento.permiteInscricaoInfantil ||
      tipoInscricaoEscolhida === tiposInscricao[1]
    ) {
      navigate(`/criar-inscricao/${evento.id}`);
    } else {
      navigate(`/criar-inscricao-infantil/${evento.id}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 min-h-screen bg-gray-100">
      <Typography variant="h4" className="text-center font-bold">
        {evento.nome}
      </Typography>

      <div className="flex flex-col gap-2">
        {tiposInscricao.map((tipo, index) => (
          <label key={tipo} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipoInscricao"
              value={tipo}
              checked={tipoInscricaoEscolhida === tipo}
              disabled={!evento.permiteInscricaoInfantil && index === 0}
              onChange={() => setTipoInscricaoEscolhida(tipo)}
            />
            {tipo}
          </label>
        ))}
      </div>

      <Card className="p-4 w-full max-w-lg flex flex-col gap-4">
        <Typography>
          Leia atentamente o regulamento!!! Ao clicar em aceitar e fazer a sua
          inscrição, você confirma que leu, compreendeu e aceitou as regras do
          encontro.
        </Typography>
        <Button variant="contained" color="primary" onClick={clicarContinuar}>
          Aceitar
        </Button>
      </Card>
    </div>
  );
}
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Divider,
  Button,
  AppBar,
  Toolbar,
} from "@mui/material";
import type { EventoListagem } from "../../interfaces/interfaces";

export default function SelecionarInscricao() {
  const location = useLocation();
  const navigate = useNavigate();
  const evento: EventoListagem | undefined = location.state?.evento;

  // Estado do tipo de inscrição
  const [tipoInscricaoEscolhida, setTipoInscricaoEscolhida] =
    useState<string>("");

  // Ajuste inicial se não permitir infantil
  useEffect(() => {
    if (evento && !evento.permiteInscricaoInfantil) {
      setTipoInscricaoEscolhida("Participante e/ou trabalhador");
    }
  }, [evento]);

  if (!evento) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg">Evento não encontrado!</p>
      </div>
    );
  }

  const tiposInscricao = [
    `Infantil (menores de ${evento.idadeMinima})`,
    "Participante e/ou trabalhador",
  ];

  const clicarContinuar = () => {
    if (evento.permiteInscricaoInfantil && !tipoInscricaoEscolhida) {
      alert(
        "VOCÊ NÃO ESCOLHEU O TIPO DE INSCRIÇÃO QUE DESEJA FAZER! Escolha um tipo de inscrição para podermos continuar!!"
      );
      return;
    }

    if (
      !evento.permiteInscricaoInfantil ||
      tipoInscricaoEscolhida === tiposInscricao[1]
    ) {
      navigate(`/criar-inscricao/${evento.id}`, { state: { evento } });
    } else {
      navigate(`/criar-inscricao-infantil/${evento.id}`, { state: { evento } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header informativo */}
      {/* Header igual ao da tela Eventos */}
      <AppBar position="static" color="primary">
        <Toolbar className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Inscrever-se</span>
            <span className="text-sm opacity-80">{evento.nome}</span>
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/eventos")}
          >
            Voltar
          </Button>
        </Toolbar>
      </AppBar>

      <Divider />

      {/* Card para tipo de inscrição e aceite */}
      <main className="flex justify-center mt-6 px-4">
        <Card className="p-6 w-full max-w-lg flex flex-col gap-4">
          <Typography variant="h6" className="font-bold">
            Escolha o tipo da inscrição
          </Typography>

          <div className="flex flex-col gap-2">
            {tiposInscricao.map((tipo, index) => (
              <label
                key={tipo}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="tipoInscricao"
                  value={tipo}
                  checked={tipoInscricaoEscolhida === tipo}
                  disabled={!evento.permiteInscricaoInfantil && index === 0}
                  onChange={() => setTipoInscricaoEscolhida(tipo)}
                />
                {tipo}
              </label>
            ))}
          </div>

          <Divider className="my-4" />

          <div className="flex flex-col gap-2">
            <Typography>
              Ao clicar em aceitar e fazer a sua inscrição, você confirma que
              leu, compreendeu e aceitou as regras do encontro.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={clicarContinuar}
            >
              Aceitar
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

/* import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Typography } from "@mui/material";
import type { EventoListagem } from "../../interfaces/interfaces";

export default function SelecionarInscricao() {
  const location = useLocation();
  const navigate = useNavigate();
  const evento: EventoListagem | undefined = location.state?.evento;

  // Estado sempre inicializado de forma segura
  const [tipoInscricaoEscolhida, setTipoInscricaoEscolhida] =
    useState<string>("");

  // Ajusta o estado baseado no evento assim que ele estiver disponível
  useEffect(() => {
    if (evento && !evento.permiteInscricaoInfantil) {
      setTipoInscricaoEscolhida("Participante e/ou trabalhador");
    }
  }, [evento]);

  if (!evento) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg">Evento não encontrado!</p>
      </div>
    );
  }

  const tiposInscricao = [
    `Infantil (menores de ${evento.idadeMinima})`,
    "Participante e/ou trabalhador",
  ];

  const clicarContinuar = () => {
    if (evento.permiteInscricaoInfantil && !tipoInscricaoEscolhida) {
      alert(
        "VOCÊ NÃO ESCOLHEU O TIPO DE INSCRIÇÃO QUE DESEJA FAZER! Escolha um tipo de inscrição para podermos continuar!!"
      );
      return;
    }

    if (
      !evento.permiteInscricaoInfantil ||
      tipoInscricaoEscolhida === tiposInscricao[1]
    ) {
      navigate(`/criar-inscricao/${evento.id}`, { state: { evento } });
    } else {
      navigate(`/criar-inscricao-infantil/${evento.id}`, { state: { evento } });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex flex-col items-center bg-blue-600 text-white p-6 gap-4">
        <Typography variant="h4" className="font-bold text-center">
          {evento.nome}
        </Typography>

        <div className="flex gap-4">
          {tiposInscricao.map((tipo, index) => (
            <label
              key={tipo}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="tipoInscricao"
                value={tipo}
                checked={tipoInscricaoEscolhida === tipo}
                disabled={!evento.permiteInscricaoInfantil && index === 0}
                onChange={() => setTipoInscricaoEscolhida(tipo)}
              />
              {tipo}
            </label>
          ))}
        </div>
      </header>

      <main className="flex justify-center mt-6 px-4">
        <Card className="p-6 w-full max-w-lg flex flex-col gap-4">
          <Typography variant="h6" className="font-bold">
            Leia atentamente o regulamento!!!
          </Typography>
          <Typography>
            Ao clicar em aceitar e fazer a sua inscrição, você confirma que leu,
            compreendeu e aceitou as regras do encontro.
          </Typography>
          <Button variant="contained" color="primary" onClick={clicarContinuar}>
            Aceitar
          </Button>
        </Card>
      </main>
    </div>
  );
} */
