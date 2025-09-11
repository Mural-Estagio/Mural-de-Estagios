// src/App.jsx

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Importação dos componentes de página e layout
import HomePage from "./Pages/Home.jsx";
import Vagas from "./Pages/Vagas.jsx";
import Curriculo from "./Pages/Curriculo.jsx"; // 1. Importe a nova página
import Layout from "./Components/Layout.jsx";
import MobileMenu from "./Components/MobileMenu.jsx";
import "./Styles/global.css";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dados para os menus
  const cursos = [
    "Análise e Desenvolvimento de Sistemas", "Desenvolvimento de Software Multiplataforma",
    "Comércio Exterior", "Gestão Empresarial", "Logística", "Polímeros",
    "Recursos Humanos", "Desenvolvimento de Recursos Plásticos",
  ];
  const documentos = ["Estágio Obrigatório", "Estágio Não Obrigatório"];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Layout toggleMobileMenu={toggleMobileMenu} cursos={cursos} documentos={documentos}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/curriculo" element={<Curriculo />} /> {/* 2. Adicione a nova rota */}
        </Routes>
      </Layout>
      
      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        cursos={cursos}
        documentos={documentos}
      />
    </>
  );
}

export default App;