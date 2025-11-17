import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../Service/api';
import ListaVagasAdmin from '../Components/ListaVagasAdmin';
import Modal from '../Components/Modal'; 
import FormularioVaga from '../Components/FormularioVaga'; 
import '../Styles/AdmCadastrar.css'; 
import '../Styles/Vagas.css'; 

const GerenciarVagas = () => {
    const [vagas, setVagas] = useState([]);
    const [loadingVagas, setLoadingVagas] = useState(true);
    const [error, setError] = useState(null);
    const [vagaParaEditar, setVagaParaEditar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [filters, setFilters] = useState({
        status: '',
        dataInicio: '',
        dataFim: '',
        vagasAntigas: false
    });

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchVagas = async () => {
        setLoadingVagas(true);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const params = {
            status: filters.status || null,
            dataInicio: filters.dataInicio || null,
            dataFim: filters.dataFim || null,
            vagasAntigas: filters.vagasAntigas ? thirtyDaysAgo.toISOString().split('T')[0] : null,
            page: currentPage,
            size: 30 
        };

        try {
            const response = await api.get('/vagas/admin/filtrar', { params });
            setVagas(response.data.content);
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar vagas filtradas.');
            console.error(err);
        } finally {
            setLoadingVagas(false);
        }
    };

    useEffect(() => {
        fetchVagas();
    }, [filters, currentPage]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentPage(0); 
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
        setVagaParaEditar(null);
        fetchVagas(); 
    };

    const handleEditClick = (vaga) => {
        setVagaParaEditar(vaga);
        setIsModalOpen(true);
    };

    const PaginationControls = () => {
       if (totalPages <= 1) return null;
       const pages = [];
       for (let i = 0; i < totalPages; i++) {
            pages.push(<button key={i} onClick={() => setCurrentPage(i)} className={`page-btn ${i === currentPage ? 'active' : ''}`}>{i + 1}</button>);
       }
       return (
            <div className="pagination-container" style={{padding: '20px 0'}}>
                <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="page-btn">&lt; Anterior</button>
                {pages}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} className="page-btn">Próxima &gt;</button>
            </div>
       );
    };

    return (
        <div className="admin-page">
            <h1 className="admin-title">GERENCIAR VAGAS</h1>
            <Link to="/admin/cadastrar" style={{marginBottom: '30px', display: 'inline-block', fontWeight: 'bold'}}>&larr; Voltar ao Dashboard</Link>

            {/* --- Área de Filtros --- */}
            <fieldset className="admin-form" style={{textAlign: 'left', background: '#fdfdfd', border: '1px solid #ddd', marginBottom: '40px'}}>
                <legend>Filtrar Vagas</legend>
                <div className="form-fields" style={{gridTemplateColumns: '1fr 1fr 1fr', gap: '15px'}}>
                    <label>Status
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">Todos os Status</option>
                            <option value="ABERTO">Ativas (Aberto)</option>
                            <option value="FECHADO">Inativas (Fechado)</option>
                        </select>
                    </label>
                    <label>Publicadas Desde
                        <input type="date" name="dataInicio" value={filters.dataInicio} onChange={handleFilterChange} />
                    </label>
                    <label>Publicadas Até
                        <input type="date" name="dataFim" value={filters.dataFim} onChange={handleFilterChange} />
                    </label>
                </div>
                <label style={{display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal', marginTop: '15px', cursor: 'pointer'}}>
                    <input 
                        type="checkbox" 
                        name="vagasAntigas" 
                        checked={filters.vagasAntigas} 
                        onChange={handleFilterChange}
                        style={{width: '16px', height: '16px', cursor: 'pointer'}} 
                    />
                    Mostrar apenas vagas com mais de 30 dias de publicação
                </label>
            </fieldset>

            {/* --- Lista de Vagas --- */}
            {loadingVagas && <p>Carregando lista de vagas...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loadingVagas && !error && (
                <>
                    <ListaVagasAdmin
                        vagas={vagas}
                        onSuccessRefresh={fetchVagas}
                        onEdit={handleEditClick}
                    />
                    <PaginationControls />
                </>
            )}

            {/* --- Modal de Edição  --- */}
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setVagaParaEditar(null); }}>
                <FormularioVaga 
                    onClose={() => { setIsModalOpen(false); setVagaParaEditar(null); }}
                    onSuccess={handleSuccess}
                    vagaParaEditar={vagaParaEditar}
                />
            </Modal>
        </div>
    );
};

export default GerenciarVagas;