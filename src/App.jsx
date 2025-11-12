import React, { useState, useEffect } from "react"; 
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home.jsx";
import Vagas from "./Pages/Vagas.jsx";
import Curriculo from "./Pages/Curriculo.jsx";
import AdmCadastrar from "./Pages/AdmCadastrar.jsx";
import LoginPage from "./Pages/Login.jsx";
import Documentos from "./Pages/Documentos.jsx";
import DocumentosObrigatorios from "./Pages/DocumentosObrigatorios.jsx";
import DocumentosNaoObrigatorios from "./Pages/DocumentosNaoObrigatorios.jsx";
import VagaDetalhada from "./Pages/VagaDetalhada.jsx"; 
import Layout from "./Components/Layout.jsx";
import MobileMenu from "./Components/MobileMenu.jsx";
import { api } from "./Service/api.js"; 
import "./Styles/global.css";

// Importar a Rota Protegida
import ProtectedRoute from "./Components/ProtectedRoute.jsx";


function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cursoList, setCursoList] = useState([]); 
  const documentos = ["Estágio Obrigatório", "Estágio Não Obrigatório"];

  useEffect(() => {
    const fetchCursos = async () => {
        try {
            const response = await api.get('/cursos');
            setCursoList(response.data); 
        } catch (err) {
            console.error("Erro ao buscar cursos:", err);

        }
    };
    fetchCursos();
  }, []); 

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Layout 
        toggleMobileMenu={toggleMobileMenu} 
        cursos={cursoList} 
        documentos={documentos} 
      >
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage cursos={cursoList} />} /> 
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/vagas/:vagaId" element={<VagaDetalhada />} /> 
          <Route path="/curriculo" element={<Curriculo />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/documentos-obrigatorios" element={<DocumentosObrigatorios />} />
          <Route path="/documentos-nao-obrigatorios" element={<DocumentosNaoObrigatorios />} />
          
          {/* Rota de Login (Pública) */}
          <Route path="/admin/Login" element={<LoginPage />} />

          {/* Rota Protegida */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/cadastrar" element={<AdmCadastrar />} />
            {/* Se você adicionar mais rotas de admin, coloque-as aqui */}
          </Route>

        </Routes>
      </Layout>
      
      <MobileMenu
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        cursos={cursoList} 
        documentos={documentos}
      />
    </>
  );
}

export default App;