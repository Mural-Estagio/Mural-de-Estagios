import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import logoFatec from '../Assets/fatec_logo.png';
import { api } from '../Service/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Função de login com a API
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            });

            if (response.status === 200) {
                setError('');
                navigate('/admin/cadastrar');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Usuário ou senha inválidos ou conta inativa.');
            } else {
                setError('Erro ao conectar com o servidor. Tente novamente.');
            }
            console.error('Erro ao autenticar:', error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <img src={logoFatec} alt="Logo da Fatec" className="login-logo" />
                <h2>Acesso Restrito</h2>
                <p>Por favor, insira suas credenciais de administrador.</p>
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label htmlFor="username">Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-button">
                        Entrar <FontAwesomeIcon icon={faSignInAlt} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
