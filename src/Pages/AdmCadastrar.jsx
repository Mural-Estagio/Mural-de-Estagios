import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserPlus, faTasks, faFileAlt, faWrench } from '@fortawesome/free-solid-svg-icons'; 
import '../Styles/AdmCadastrar.css';
import '../Styles/DashboardGraphs.css'; 
import { api } from '../Service/api';
import DashboardStats from '../Components/DashboardStats';
import FormularioAdmin from '../Components/FormularioAdmin'; 
import DashboardGraphs from '../Components/DashboardGraphs'; 
import Modal from '../Components/Modal'; 
import FormularioVaga from '../Components/FormularioVaga';
import FormularioHabilidade from '../Components/FormularioHabilidade'; 

const FormularioCurso = ({ onClose }) => {
    const [cursos, setCursos] = useState([]);
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [sigla, setSigla] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCursos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/cursos');
            setCursos(response.data);
            setError('');
        } catch (err) { setError('Erro ao buscar cursos.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCursos(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/cursos', { nomeCompleto, sigla });
            setNomeCompleto('');
            setSigla('');
            fetchCursos(); 
        } catch (err) { 
             if (err.response && err.response.status === 403) {
                 setError('Acesso Negado. Você não tem permissão de ADMINISTRADOR.');
            } else {
                setError(err.response?.data?.message || 'Erro ao salvar curso.'); 
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este curso? Vagas associadas a ele podem perder a referência.')) {
            try {
                await api.delete(`/cursos/${id}`);
                fetchCursos(); 
            } catch (err) { 
                 if (err.response && err.response.status === 403) {
                     setError('Acesso Negado. Você não tem permissão de ADMINISTRADOR.');
                } else {
                    setError('Erro ao excluir curso.'); 
                }
            }
        }
    };

    return (
        <div className="admin-form">
            <h2>Gerenciar Cursos</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="form-fields">
                <label>Nome Completo <input type="text" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required /></label>
                <label>Sigla (ex: ADS) <input type="text" value={sigla} onChange={(e) => setSigla(e.target.value)} required /></label>
                <button type="submit" className="submit-button">ADICIONAR CURSO</button>
            </form>
            <hr style={{margin: '20px 0'}} />
            <h4>Cursos Existentes</h4>
            {loading ? <p>Carregando cursos...</p> : (
                <ul className="curso-list">
                    {cursos.map(curso => (
                        <li key={curso.id}>
                            <span>{curso.nomeCompleto} ({curso.sigla})</span>
                            <button onClick={() => handleDelete(curso.id)} className="delete-btn">Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const AdmCadastrar = () => {
    const [isVagaModalOpen, setIsVagaModalOpen] = useState(false);
    const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isHabilidadeModalOpen, setIsHabilidadeModalOpen] = useState(false); 
    const [vagas, setVagas] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [vagasRes, cursosRes] = await Promise.all([
                api.get('/vagas/admin/filtrar', { params: { size: 1000 } }), 
                api.get('/cursos')
            ]);
            setVagas(vagasRes.data.content || []);
            setCursos(cursosRes.data || []);
            setError(null);
        } catch (err) {
            console.error("Erro ao carregar dados do dashboard:", err);
            setError('Erro ao carregar dados do dashboard.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDashboardData(); 
    }, []);

    const handleVagaSuccess = () => {
        setIsVagaModalOpen(false);
        fetchDashboardData(); 
    };
    
    const handleAdminSuccess = () => {
        setIsAdminModalOpen(false);
    };

    return (
        <div className="admin-page">
            <h1 className="admin-title">PAINEL DE CONTROLE</h1>
            <DashboardStats vagas={vagas} loading={loading} />
            <DashboardGraphs vagas={vagas} cursos={cursos} loading={loading} />

            <div className="admin-actions">
                <button className="action-button" onClick={() => setIsVagaModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> NOVA VAGA
                </button>
                <Link to="/admin/gerenciar-vagas" className="action-button">
                    <FontAwesomeIcon icon={faTasks} /> GERENCIAR VAGAS
                </Link>
                <button className="action-button" onClick={() => setIsCursoModalOpen(true)}>
                    <FontAwesomeIcon icon={faFileAlt} /> GERENCIAR CURSOS
                </button>
                {/* --- 4. Novo Botão --- */}
                <button className="action-button" onClick={() => setIsHabilidadeModalOpen(true)}>
                    <FontAwesomeIcon icon={faWrench} /> GERENCIAR HABILIDADES
                </button>
                <button className="action-button" onClick={() => setIsAdminModalOpen(true)}>
                    <FontAwesomeIcon icon={faUserPlus} /> NOVO USUÁRIO
                </button>
            </div>
            
            {loading && <p>Carregando dashboard...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {/* --- Modais --- */}
            <Modal isOpen={isVagaModalOpen} onClose={() => setIsVagaModalOpen(false)}>
                <FormularioVaga 
                    onClose={() => setIsVagaModalOpen(false)} 
                    onSuccess={handleVagaSuccess}
                    vagaParaEditar={null}
                />
            </Modal>
            <Modal isOpen={isCursoModalOpen} onClose={() => setIsCursoModalOpen(false)}>
                <FormularioCurso onClose={() => setIsCursoModalOpen(false)} />
            </Modal>
            <Modal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)}>
                <FormularioAdmin 
                    onClose={() => setIsAdminModalOpen(false)} 
                    onSuccess={handleAdminSuccess}
                />
            </Modal>
            <Modal isOpen={isHabilidadeModalOpen} onClose={() => setIsHabilidadeModalOpen(false)}>
                <FormularioHabilidade onClose={() => setIsHabilidadeModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdmCadastrar;