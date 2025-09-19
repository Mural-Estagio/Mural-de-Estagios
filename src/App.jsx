// src/App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home.jsx";
import Vagas from "./Pages/Vagas.jsx";
import Curriculo from "./Pages/Curriculo.jsx";
import AdmCadastrar from "./Pages/AdmCadastrar.jsx";
import LoginPage from "./Pages/Login.jsx";
import Documentos from "./Pages/Documentos.jsx";
import DocumentosObrigatorios from "./Pages/DocumentosObrigatorios.jsx";
import DocumentosNaoObrigatorios from "./Pages/DocumentosNaoObrigatorios.jsx";
import VagaDetalhada from "./Pages/VagaDetalhada.jsx"; // 1. Importe a nova página
import Layout from "./Components/Layout.jsx";
import MobileMenu from "./Components/MobileMenu.jsx";
import "./Styles/global.css";


function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cursos = [ "Análise e Desenvolvimento de Sistemas", "Desenvolvimento de Software Multiplataforma", "Comércio Exterior", "Gestão Empresarial", "Logística", "Polímeros", "Recursos Humanos", "Desenvolvimento de Produtos Plásticos" ];
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
          <Route path="/vagas/:vagaId" element={<VagaDetalhada />} /> {/* 2. Adicione a rota dinâmica */}
          <Route path="/curriculo" element={<Curriculo />} />
          <Route path="/admin/cadastrar" element={<AdmCadastrar />} />
          <Route path="/admin/Login" element={<LoginPage />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/documentos-obrigatorios" element={<DocumentosObrigatorios />} />
          <Route path="/documentos-nao-obrigatorios" element={<DocumentosNaoObrigatorios />} />
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