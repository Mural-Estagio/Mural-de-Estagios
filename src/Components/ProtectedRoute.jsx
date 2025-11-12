import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Função simples para verificar se o token existe no localStorage
const useAuth = () => {
  const token = localStorage.getItem('authToken');
  return token != null; // Retorna true se o token existir, false se não
};

const ProtectedRoute = () => {
  const isAuth = useAuth();

  // Se o usuário está autenticado (tem o token), renderiza o componente filho (Outlet)
  // Se não, redireciona para a página de login
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;