import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Divider,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { buscarEventosDisponiveis } from "../../services/eventos/eventosServices";
import type { EventoListagem } from "../../interfaces/interfaces";

export default function Eventos() {
  const [eventos, setEventos] = useState<EventoListagem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const dados = await buscarEventosDisponiveis();
        //TODO analisarAki
        //console.log(dados);
        setEventos(dados);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarEventos();
  }, []);

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h1 className="text-2xl font-semibold">Carregando eventos...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <AppBar position="static" color="primary">
        <Toolbar className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Inscrições</span>
            <span className="text-sm opacity-80">Versão: 2.0.0</span>
          </div>
          <Button variant="contained" color="secondary" href="/pesquisar">
            Acompanhar Inscrição
          </Button>
        </Toolbar>
      </AppBar>

      {/* Conteúdo */}
      <div className="flex flex-wrap justify-center items-start gap-6 p-6">
        {/* Caso não existam eventos */}
        {eventos.length === 0 ? (
          <div className="flex flex-col items-center text-gray-600 mt-16">
            <i className="fas fa-bullhorn fa-5x mb-4"></i>
            <div className="text-lg font-medium">
              Não há eventos disponíveis hoje.
            </div>
          </div>
        ) : (
          eventos.map((evento) => (
            <Card
              key={evento.id}
              className="w-80 flex flex-col items-center shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={evento.logotipo}
                alt={`Imagem do evento ${evento.nome}`}
                className="w-full h-48 object-cover rounded-t-md"
              />
              <CardContent className="flex flex-col items-center text-center gap-2">
                <Typography variant="h6" className="font-bold">
                  {evento.nome}
                </Typography>
                <Typography variant="body2">
                  Inscrições:{" "}
                  <span className="font-bold">
                    {new Date(
                      evento.periodoInscricao.dataInicial
                    ).toLocaleDateString()}{" "}
                  </span>
                  à{" "}
                  <span className="font-bold">
                    {new Date(
                      evento.periodoInscricao.dataFinal
                    ).toLocaleDateString()}
                  </span>
                </Typography>
                <Typography variant="body2">
                  Realização:{" "}
                  <span className="font-bold">
                    {new Date(
                      evento.periodoRealizacao.dataInicial
                    ).toLocaleDateString()}{" "}
                  </span>
                  à{" "}
                  <span className="font-bold">
                    {new Date(
                      evento.periodoRealizacao.dataFinal
                    ).toLocaleDateString()}
                  </span>
                </Typography>
                <Divider className="w-full my-2" />
                <Button
                  variant="contained"
                  color="primary"
                  href={`/comecar/${evento.id}`}
                >
                  INSCREVER-SE
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
