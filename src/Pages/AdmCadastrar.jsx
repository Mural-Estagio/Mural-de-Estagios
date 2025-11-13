import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faUpload, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '../Styles/AdmCadastrar.css';
import '../Styles/DashboardGraphs.css'; 
import { api } from '../Service/api';
import DashboardStats from '../Components/DashboardStats';
import ListaVagasAdmin from '../Components/ListaVagasAdmin';
import FormularioAdmin from '../Components/FormularioAdmin'; 
import DashboardGraphs from '../Components/DashboardGraphs'; 
const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label="Fechar">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                {children}
            </div>
        </div>
    );
};


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

const TagInput = ({ label, items, setItems }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { 
            e.preventDefault();
            const newItem = inputValue.trim();
            if (newItem && !items.includes(newItem)) {
                setItems([...items, newItem]);
            }
            setInputValue('');
        }
    };

    const handleRemoveItem = (indexToRemove) => {
        setItems(items.filter((_, index) => index !== indexToRemove));
    };

    return (
        <label className="tag-input-container">
            {label} (Pressione Enter para adicionar)
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite um item e pressione Enter..."
            />
            <div className="tag-input-area">
                {items.map((item, index) => (
                    <span key={index} className="tag-item">
                        {item}
                        <button type="button" onClick={() => handleRemoveItem(index)}>×</button>
                    </span>
                ))}
            </div>
        </label>
    );
};

const CursoAutoComplete = ({ cursosDisponiveis, selectedCursos, setSelectedCursos }) => {
    const [inputValue, setInputValue] = useState('');
    const cursosList = Object.entries(cursosDisponiveis).map(([nome, sigla]) => ({ nome, sigla }));

    const handleAddCurso = (e) => {
        const cursoSelecionado = cursosList.find(c => c.nome.toLowerCase() === inputValue.toLowerCase());
        
        if (cursoSelecionado) {
            const sigla = cursoSelecionado.sigla;
            if (!selectedCursos.includes(sigla)) {
                setSelectedCursos([...selectedCursos, sigla]);
            }
            setInputValue(''); 
        }
        
        if (e.key === 'Enter') {
             e.preventDefault();
             setInputValue('');
        }
    };
    
    const handleRemoveCurso = (siglaToRemove) => {
        setSelectedCursos(selectedCursos.filter(sigla => sigla !== siglaToRemove));
    };

    return (
         <label className="tag-input-container">
            Cursos Alvo (Comece a digitar e selecione da lista)
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCurso(e)}
                onBlur={handleAddCurso} 
                list="cursos-datalist"
                placeholder="Digite o nome de um curso..."
            />
            <datalist id="cursos-datalist">
                {cursosList.map(({ nome, sigla }) => (
                    <option key={sigla} value={nome} />
                ))}
            </datalist>
            
            <div className="tag-input-area">
                {selectedCursos.map((sigla) => (
                    <span key={sigla} className="tag-item">
                        {cursosList.find(c => c.sigla === sigla)?.nome || sigla}
                        <button type="button" onClick={() => handleRemoveCurso(sigla)}>×</button>
                    </span>
                ))}
            </div>
        </label>
    );
};

const FormularioVaga = ({ onClose, onSuccess, vagaParaEditar }) => {
    
    const isEditMode = vagaParaEditar != null;

    const estadoInicialForm = {
        empresa: '', titulo: '', remuneracao: '', periodo: '', canal: '',
        link: '', beneficios: [], requisitos: [], modelo: 'PRESENCIAL',
        diferenciais: [], responsabilidades: [], 
        dataPublicacao: new Date().toISOString().split('T')[0],
        statusVaga: 'ABERTO',
    };

    const [formData, setFormData] = useState(estadoInicialForm);
    const [cursosDisponiveis, setCursosDisponiveis] = useState({});
    const [cursosSelecionados, setCursosSelecionados] = useState([]); 
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/cursos')
            .then(response => {
                const cursosMap = response.data.reduce((acc, curso) => {
                    acc[curso.nomeCompleto] = curso.sigla; 
                    return acc;
                }, {});
                setCursosDisponiveis(cursosMap);
            })
            .catch(err => console.error("Erro ao buscar cursos", err));
    }, []);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                ...vagaParaEditar,
                beneficios: vagaParaEditar.beneficios || [],
                requisitos: vagaParaEditar.requisitos || [],
                diferenciais: vagaParaEditar.diferenciais || [],
                responsabilidades: vagaParaEditar.responsabilidades || [],
                dataPublicacao: vagaParaEditar.dataPublicacao ? new Date(vagaParaEditar.dataPublicacao).toISOString().split('T')[0] : '',
            });
            setCursosSelecionados(vagaParaEditar.cursosAlvo || []);
            setFile(null); 
            setError('');
        } else {
            setFormData(estadoInicialForm);
            setCursosSelecionados([]);
            setFile(null);
            setError('');
        }
    }, [vagaParaEditar, isEditMode]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (fieldName, newItems) => {
        setFormData(prev => ({ ...prev, [fieldName]: newItems }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (cursosSelecionados.length === 0) {
            setError('Selecione pelo menos um curso alvo.');
            return;
        }

        const vagaDTO = { ...formData, cursosAlvo: cursosSelecionados };
        
        try {
            if (isEditMode) {
                delete vagaDTO.folderUrl; 
                await api.put(`/vagas/${vagaParaEditar.id}`, vagaDTO);
                alert('✅ Vaga atualizada com sucesso!');
            } else {
                const formDataToSend = new FormData();
                formDataToSend.append('vagaDTO', JSON.stringify(vagaDTO));
                if (file) {
                    formDataToSend.append('file', file);
                }
                await api.post('/vagas', formDataToSend, { headers: {} });
                alert('✅ Vaga cadastrada com sucesso!');
            }
            onSuccess(); 
        } catch (err) {
            console.error('Erro ao salvar vaga:', err);
             if (err.response && err.response.status === 403) {
                 setError('Acesso Negado. O seu utilizador não tem permissão para esta ação.');
            } else {
                setError(err.response?.data?.message || err.message || 'Erro inesperado ao salvar vaga.');
            }
        }
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{isEditMode ? 'Editar Vaga' : 'Cadastrar Nova Vaga'}</h2>
            {error && <p className="error-message">{error}</p>}
            
            <fieldset>
                <legend>Informações Principais</legend>
                <div className="form-fields">
                    <label>Empresa <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} required /></label>
                    <label>Título da Vaga <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required /></label>
                    <label>Remuneração <input type="text" name="remuneracao" value={formData.remuneracao} onChange={handleChange} placeholder="Ex: 2500, A combinar" /></label>
                    <label>Período (Horário) <input type="text" name="periodo" value={formData.periodo} onChange={handleChange} /></label>
                    <label>Canal de Inscrição <input type="text" name="canal" value={formData.canal} onChange={handleChange} /></label>
                    <label>Link da Vaga <input type="url" name="link" value={formData.link} onChange={handleChange} required /></label>
                    <label>Modelo de Trabalho
                        <select name="modelo" value={formData.modelo} onChange={handleChange}>
                            <option value="PRESENCIAL">Presencial</option>
                            <option value="HIBRIDO">Híbrido</option>
                            <option value="HOME_OFFICE">Home Office</option>
                        </select>
                    </label>
                    <label>Data de Publicação
                        <input type="date" name="dataPublicacao" value={formData.dataPublicacao} onChange={handleChange} required />
                    </label>
                </div>
            </fieldset>

            <fieldset>
                <legend>Listas de Detalhes</legend>
                <TagInput 
                    label="Benefícios"
                    items={formData.beneficios}
                    setItems={(items) => handleTagChange('beneficios', items)}
                />
                <TagInput 
                    label="Requisitos"
                    items={formData.requisitos}
                    setItems={(items) => handleTagChange('requisitos', items)}
                />
                <TagInput 
                    label="Diferenciais"
                    items={formData.diferenciais}
                    setItems={(items) => handleTagChange('diferenciais', items)}
                />
                <TagInput 
                    label="Responsabilidades"
                    items={formData.responsabilidades}
                    setItems={(items) => handleTagChange('responsabilidades', items)}
                />
            </fieldset>

            <fieldset>
                <legend>Cursos e Anexos</legend>
                {!isEditMode && (
                    <label>Folder (Opcional)
                        <div className="upload-area" onClick={() => document.getElementById('file-upload').click()}>
                            <input type="file" id="file-upload" onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx" />
                            {file ? ( <span>Arquivo selecionado: {file.name}</span> ) : (
                                <>
                                    <FontAwesomeIcon icon={faUpload} />
                                    <span>Clique para adicionar um folder (PDF, DOCX)</span>
                                </>
                            )}
                        </div>
                    </label>
                )}
                {isEditMode && (
                    <p className="form-info-message">A edição do arquivo anexo (folder) não é suportada.</p>
                )}

                <CursoAutoComplete
                    cursosDisponiveis={cursosDisponiveis}
                    selectedCursos={cursosSelecionados}
                    setSelectedCursos={setCursosSelecionados}
                />
            </fieldset>
            
            <button type="submit" className="submit-button">
                 {isEditMode ? 'ATUALIZAR VAGA' : 'CADASTRAR VAGA'}
            </button>
        </form>
    );
};


const AdmCadastrar = () => {
    const [isVagaModalOpen, setIsVagaModalOpen] = useState(false);
    const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [vagas, setVagas] = useState([]);
    const [loadingVagas, setLoadingVagas] = useState(true); 
    const [error, setError] = useState(null);
    const [vagaParaEditar, setVagaParaEditar] = useState(null); 
    const [cursos, setCursos] = useState([]);
    const [loadingCursos, setLoadingCursos] = useState(true);
    const fetchVagas = async () => {
        setLoadingVagas(true);
        try {
            const response = await api.get('/vagas'); 
            const vagasOrdenadas = response.data.sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
            setVagas(vagasOrdenadas);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar vagas.');
            console.error(err);
        } finally {
            setLoadingVagas(false);
        }
    };
    useEffect(() => {
        const fetchCursos = async () => {
            setLoadingCursos(true);
            try {
                const response = await api.get('/cursos');
                setCursos(response.data);
            } catch (err) {
                console.error("Erro ao buscar cursos:", err);
                setError('Erro ao carregar cursos.');
            } finally {
                setLoadingCursos(false);
            }
        };
        
        fetchVagas();
        fetchCursos(); 
    }, []);

    const handleSuccess = () => {
        fetchVagas(); 
        handleCloseModal(); 
    };
    
    const handleAdminSuccess = () => {
        setIsAdminModalOpen(false);
    };

    const handleEditClick = (vaga) => {
        setVagaParaEditar(vaga);
        setIsVagaModalOpen(true);
    };

    const handleCreateClick = () => {
        setVagaParaEditar(null);
        setIsVagaModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsVagaModalOpen(false);
        setVagaParaEditar(null);
    };
    const isLoading = loadingVagas || loadingCursos;

    return (
        <div className="admin-page">
            <h1 className="admin-title">PAINEL DE CONTROLE</h1>
            <DashboardStats vagas={vagas} loading={isLoading} />
            <DashboardGraphs vagas={vagas} cursos={cursos} loading={isLoading} />

            <div className="admin-actions">
                <button className="action-button" onClick={handleCreateClick}>
                    <FontAwesomeIcon icon={faPlus} /> NOVA VAGA
                </button>
                <button className="action-button" onClick={() => setIsCursoModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> GERENCIAR CURSOS
                </button>
                <button className="action-button" onClick={() => setIsAdminModalOpen(true)}>
                    <FontAwesomeIcon icon={faUserPlus} /> NOVO USUÁRIO
                </button>
            </div>
            
            {isLoading && <p>Carregando lista de vagas...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
                <ListaVagasAdmin 
                    vagas={vagas} 
                    onSuccessRefresh={handleSuccess} 
                    onEdit={handleEditClick}
                />
            )}

            <Modal isOpen={isVagaModalOpen} onClose={handleCloseModal}>
                <FormularioVaga 
                    onClose={handleCloseModal} 
                    onSuccess={handleSuccess}
                    vagaParaEditar={vagaParaEditar}
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
        </div>
    );
};

export default AdmCadastrar;