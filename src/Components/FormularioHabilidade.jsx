import React, { useState, useEffect } from 'react';
import { api } from '../Service/api';
import '../Styles/AdmCadastrar.css'; 

const FormularioHabilidade = ({ onClose }) => {
    const [habilidades, setHabilidades] = useState([]);
    const [nome, setNome] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchHabilidades = async () => {
        setLoading(true);
        try {
            const response = await api.get('/habilidades');
            const sorted = response.data.sort((a, b) => a.nome.localeCompare(b.nome));
            setHabilidades(sorted);
            setError('');
        } catch (err) {
            setError('Erro ao buscar habilidades.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabilidades();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!nome.trim()) {
            setError('O nome da habilidade não pode ser vazio.');
            return;
        }

        try {
            await api.post('/habilidades', { nome });
            setNome('');
            fetchHabilidades(); 
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError('Acesso Negado. Você não tem permissão.');
            } else {
                setError(err.response?.data?.message || 'Erro ao salvar habilidade.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta habilidade?')) {
            try {
                await api.delete(`/habilidades/${id}`);
                fetchHabilidades(); 
            } catch (err) {
                if (err.response && err.response.status === 403) {
                    setError('Acesso Negado. Você não tem permissão.');
                } else {
                    setError('Erro ao excluir habilidade.');
                }
            }
        }
    };

    return (
        <div className="admin-form">
            <h2>Gerenciar Habilidades</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="form-fields" style={{ gridTemplateColumns: '1fr' }}>
                <label>Nome da Habilidade
                    <input 
                        type="text" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        placeholder="Ex: React, Liderança, Excel Avançado..."
                        required 
                    />
                </label>
                <button type="submit" className="submit-button">ADICIONAR HABILIDADE</button>
            </form>
            <hr style={{ margin: '20px 0' }} />
            <h4>Habilidades Existentes</h4>
            {loading ? <p>Carregando habilidades...</p> : (
                <ul className="curso-list">
                    {habilidades.length === 0 && <p>Nenhuma habilidade cadastrada.</p>}
                    {habilidades.map(h => (
                        <li key={h.id}>
                            <span>{h.nome}</span>
                            <button onClick={() => handleDelete(h.id)} className="delete-btn">Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FormularioHabilidade;