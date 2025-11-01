import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Eventos from "../pages/Eventos/Eventos";
import SelecionarInscricao from "../pages/Inscrição/SelecionarInscricao";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/evento/:id/inscricao" element={<SelecionarInscricao />} />
        {/* depois adicionaremos */}
        {/* <Route path="/criar-inscricao/:id" element={<CriarInscricao />} /> */}
        {/* <Route path="/criar-inscricao-infantil/:id" element={<CriarInscricaoInfantil />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
