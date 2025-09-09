
import React, { useState } from "react";
import HomePage from "./Pages/Home.jsx"; 
import Layout from "./Components/Layout.jsx";
import MobileMenu from "./Components/MobileMenu.jsx";
import "./Styles/global.css";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dados que serão usados pelo Header e pelo MobileMenu
  const cursos = [
    "Análise e Desenvolvimento de Sistemas",
    "Desenvolvimento de Software Multiplataforma",
    "Comércio Exterior",
    "Gestão Empresarial",
    "Logística",
    "Polímeros",
    "Recursos Humanos",
    "Desenvolvimento de Recursos Plásticos",
  ];

  const documentos = [
    "Estágio Obrigatório",
    "Estágio Não Obrigatório"
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Layout toggleMobileMenu={toggleMobileMenu} cursos={cursos} documentos={documentos}>
        <HomePage /> 
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