import React, { useState, useEffect } from 'react';
import { api } from '../Service/api';
import '../Styles/AdmCadastrar.css';

const FormularioAdmin = ({ onClose, onSuccess }) => {
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [role, setRole] = useState('ESTAGIARIO');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);

    const carregarUsuarios = async () => {
        try {
            const response = await api.get('/administradores');

            const ordenados = response.data.sort((a, b) => {
                if (a.status === 'INATIVO' && b.status !== 'INATIVO') return 1;
                if (a.status !== 'INATIVO' && b.status === 'INATIVO') return -1;
                return a.nome.localeCompare(b.nome);
            });

            setUsuarios(ordenados);

        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const handleDeactivate = async (id) => {
        if (!window.confirm('Deseja realmente inativar este usuário?')) {
            return;
        }

        try {
            await api.patch(`/administradores/${id}`);

            carregarUsuarios();

        } catch (err) {
            console.error(err);
            alert('Erro ao inativar usuário: ' + err.response.data.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (senha.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const adminDTO = {
                nome,
                senha,
                role,
                status: 'ATIVO'
            };

            await api.post('/administradores', adminDTO);

            alert('✅ Usuário cadastrado com sucesso!');

            setNome('');
            setSenha('');
            setRole('ESTAGIARIO');

            carregarUsuarios();

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {
            console.error('Erro ao salvar admin:', err);

            if (err.response?.status === 403) {
                setError(
                    'Acesso Negado. Você não tem permissão de ADMINISTRADOR para criar usuários.'
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Erro inesperado ao salvar usuário.'
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <h2>Cadastrar Novo Usuário</h2>

            {error && <p className="error-message">{error}</p>}

            <div
                className="form-fields"
                style={{ gridTemplateColumns: '1fr' }}
            >
                <label>
                    Nome de Usuário
                    <input
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Senha Provisória (mín. 6 caracteres)
                    <input
                        type="password"
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Perfil (Cargo)
                    <select
                        name="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="ESTAGIARIO">
                            ESTAGIÁRIO (Gerencia Vagas)
                        </option>

                        <option value="ADMINISTRADOR">
                            ADMINISTRADOR (Controle Total)
                        </option>
                    </select>
                </label>
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={loading}
            >
                {loading
                    ? 'Cadastrando...'
                    : 'CADASTRAR USUÁRIO'}
            </button>

            <hr style={{ margin: '30px 0' }} />

            <h3>Usuários Cadastrados</h3>

            <div className="admin-users-list">
                {usuarios.map(usuario => (
                    <div
                        key={usuario.id}
                        className={`admin-user-row ${usuario.status === 'INATIVO'
                                ? 'inactive'
                                : ''
                            }`}
                    >
                        <div>
                            <strong>{usuario.nome}</strong>

                            <span>
                                {' '}
                                ({usuario.role})
                            </span>
                        </div>

                        {usuario.status !== 'INATIVO' ? (
                            <button
                                type="button"
                                className="deactivate-btn"
                                onClick={() =>
                                    handleDeactivate(usuario.id)
                                }
                                title="Inativar usuário"
                            >
                                ✕
                            </button>
                        ) : (
                            <span className="inactive-label">
                                INATIVO
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </form>
    );
};

export default FormularioAdmin;