import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import logoFatec from '../Assets/fatec_logo.png';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Simulação de login
    const handleLogin = (e) => {
        e.preventDefault(); 
        if (username === 'admin' && password === 'admin123') {
            setError('');
            navigate('/admin/cadastrar');
        } else {
            setError('Usuário ou senha inválidos.');
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
