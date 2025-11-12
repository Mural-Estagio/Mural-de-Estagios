import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081',
    validateStatus: (status) => {
        return status >= 200 && status < 300;
      },
});

// --- NOVO INTERCEPTOR ---
// Isso "intercepta" cada requisição ANTES dela ser enviada
api.interceptors.request.use(
    (config) => {
        // Pega o token do localStorage
        const token = localStorage.getItem('authToken');
        
        // Se o token existir, adiciona ao cabeçalho (Header)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- NOVO INTERCEPTOR DE RESPOSTA ---
// Isso "intercepta" cada resposta DEPOIS que ela é recebIDA
api.interceptors.response.use(
  (response) => response, // Se a resposta for OK (2xx), não faz nada
  (error) => {
    // Se a API retornar um erro 401 (Não Autorizado)
    if (error.response && error.response.status === 401) {
        // Limpa o token antigo
        localStorage.removeItem('authToken');
        // Redireciona o usuário para a página de login
        // Usamos window.location para funcionar fora dos componentes React
        window.location.href = '/admin/login'; 
    }
    return Promise.reject(error);
  }
);


export { api }