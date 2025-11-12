import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faUpload, faChartBar } from '@fortawesome/free-solid-svg-icons';
import '../Styles/AdmCadastrar.css';
import { api } from '../Service/api';

// Novos imports
import DashboardStats from '../Components/DashboardStats';
import ListaVagasAdmin from '../Components/ListaVagasAdmin';


// --- MODAL COMPONENT ---
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


// --- FORMULÁRIO DE CURSO (Sem alterações) ---
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
            fetchCursos(); // Refresh list
        } catch (err) { setError(err.response?.data?.message || 'Erro ao salvar curso.'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este curso? Vagas associadas a ele podem perder a referência.')) {
            try {
                await api.delete(`/cursos/${id}`);
                fetchCursos(); // Refresh list
            } catch (err) { setError('Erro ao excluir curso.'); }
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


// --- FORMULÁRIO DE VAGA (MODIFICADO PARA EDIÇÃO) ---
const FormularioVaga = ({ onClose, onSuccess, vagaParaEditar }) => {
    
    // Verifica se está em modo de edição
    const isEditMode = vagaParaEditar != null;

    const estadoInicialForm = {
        empresa: '',
        titulo: '',
        remuneracao: '',
        periodo: '',
        canal: '',
        link: '',
        beneficios: '',
        requisitos: '',
        modelo: 'PRESENCIAL',
        diferenciais: '',
        responsabilidades: '',
        dataPublicacao: new Date().toISOString().split('T')[0],
        statusVaga: 'ABERTO',
    };

    const [formData, setFormData] = useState(estadoInicialForm);
    const [cursosDisponiveis, setCursosDisponiveis] = useState({});
    const [cursosSelecionados, setCursosSelecionados] = useState([]);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    // Buscar cursos da API
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

    // Efeito para preencher o formulário se estiver em modo de edição
    useEffect(() => {
        if (isEditMode) {
            setFormData({
                ...vagaParaEditar,
                // Converte arrays de volta para strings separadas por vírgula
                beneficios: vagaParaEditar.beneficios?.join(', ') || '',
                requisitos: vagaParaEditar.requisitos?.join(', ') || '',
                diferenciais: vagaParaEditar.diferenciais?.join(', ') || '',
                responsabilidades: vagaParaEditar.responsabilidades?.join(', ') || '',
                // Garante que a data esteja no formato YYYY-MM-DD
                dataPublicacao: vagaParaEditar.dataPublicacao ? new Date(vagaParaEditar.dataPublicacao).toISOString().split('T')[0] : '',
            });
            setCursosSelecionados(vagaParaEditar.cursosAlvo || []);
            setFile(null); // Reseta o arquivo ao abrir o modal
            setError('');
        } else {
            // Reseta o form se não for modo de edição (ex: abriu para editar, fechou, abriu para criar)
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

    const handleCursoChange = (e) => {
        const { value, checked } = e.target;
        setCursosSelecionados(prev =>
            checked ? [...prev, value] : prev.filter(curso => curso !== value)
        );
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

        // Prepara o DTO (objeto JSON)
        const vagaDTO = {
            ...formData,
            beneficios: formData.beneficios.split(',').map(s => s.trim()).filter(Boolean),
            requisitos: formData.requisitos.split(',').map(s => s.trim()).filter(Boolean),
            diferenciais: formData.diferenciais.split(',').map(s => s.trim()).filter(Boolean),
            responsabilidades: formData.responsabilidades.split(',').map(s => s.trim()).filter(Boolean),
            cursosAlvo: cursosSelecionados,
        };

        try {
            if (isEditMode) {
                // Modo Edição (PUT) - Envia apenas JSON
                // O endpoint PUT não foi projetado para multipart/form-data
                // A atualização de arquivo (folder) não é suportada nesta ação.
                // O VagaService.updateVagaFields já ignora campos nulos/em branco
                
                // Remove o folderUrl para não tentar sobrescrevê-lo com um valor antigo
                delete vagaDTO.folderUrl; 
                
                await api.put(`/vagas/${vagaParaEditar.id}`, vagaDTO);
                alert('✅ Vaga atualizada com sucesso!');
                
            } else {
                // Modo Criação (POST) - Envia FormData (JSON + Arquivo)
                const formDataToSend = new FormData();
                formDataToSend.append('vagaDTO', JSON.stringify(vagaDTO));
                if (file) {
                    formDataToSend.append('file', file);
                }
                
                await api.post('/vagas', formDataToSend, {
                     headers: {
                        // O Axios define o 'Content-Type' como 'multipart/form-data' automaticamente
                     },
                });
                alert('✅ Vaga cadastrada com sucesso!');
            }
            
            onSuccess(); // Chama a função de refresh e fecha o modal

        } catch (err) {
            console.error('Erro ao salvar vaga:', err);
            setError(err.response?.data?.message || err.message || 'Erro inesperado ao salvar vaga.');
        }
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{isEditMode ? 'Editar Vaga' : 'Cadastrar Nova Vaga'}</h2>
            {error && <p className="error-message">{error}</p>}
            
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

            <label>Benefícios (separados por vírgula)
                <textarea name="beneficios" value={formData.beneficios} onChange={handleChange} rows="3"></textarea>
            </label>

            <label>Requisitos (separados por vírgula)
                <textarea name="requisitos" value={formData.requisitos} onChange={handleChange} rows="3"></textarea>
            </label>

            <label>Diferenciais (separados por vírgula)
                <textarea name="diferenciais" value={formData.diferenciais} onChange={handleChange} rows="3"></textarea>
            </label>

            <label>Responsabilidades (separadas por vírgula)
                <textarea name="responsabilidades" value={formData.responsabilidades} onChange={handleChange} rows="4"></textarea>
            </label>

            {/* Oculta o upload se estiver editando, pois o endpoint PUT não suporta */}
            {!isEditMode && (
                <label>Folder (Opcional)
                    <div className="upload-area" onClick={() => document.getElementById('file-upload').click()}>
                        <input type="file" id="file-upload" onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.doc,.docx" />
                        {file ? (
                            <span>Arquivo selecionado: {file.name}</span>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faUpload} />
                                <span>Clique para adicionar um folder (PDF, DOCX)</span>
                            </>
                        )}
                    </div>
                </label>
            )}
            {isEditMode && (
                <p className="form-info-message">A edição do arquivo anexo (folder) não é suportada. Para alterar o anexo, é necessário apagar e cadastrar a vaga novamente.</p>
            )}


            <div className="form-group-cursos">
                <h4>Cursos Alvo (Selecione ao menos um)</h4>
                <div className="cursos-checkbox-container">
                    {Object.entries(cursosDisponiveis).map(([fullName, sigla]) => (
                        <label key={sigla} className="curso-checkbox">
                            <input 
                                type="checkbox" 
                                value={sigla} 
                                // Marca os checkboxes com base no estado
                                checked={cursosSelecionados.includes(sigla)}
                                onChange={handleCursoChange} 
                            /> {fullName}
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="submit-button">
                 {isEditMode ? 'ATUALIZAR VAGA' : 'CADASTRAR VAGA'}
            </button>
        </form>
    );
};


// --- COMPONENTE PRINCIPAL (MODIFICADO) ---
const AdmCadastrar = () => {
    const [isVagaModalOpen, setIsVagaModalOpen] = useState(false);
    const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);
    
    // Estado para guardar os dados do dashboard
    const [vagas, setVagas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para controlar a edição
    const [vagaParaEditar, setVagaParaEditar] = useState(null); 

    // Função para buscar todas as vagas
    const fetchVagas = async () => {
        setLoading(true);
        try {
            const response = await api.get('/vagas');
            // Ordena as vagas da mais nova para a mais antiga
            const vagasOrdenadas = response.data.sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
            setVagas(vagasOrdenadas);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar vagas.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Buscar vagas quando o componente montar
    useEffect(() => {
        fetchVagas();
    }, []);

    // Função de callback para atualizar a lista após criar/editar/deletar
    const handleSuccess = () => {
        fetchVagas(); // Re-busca os dados
        handleCloseModal(); // Fecha o modal e limpa o estado de edição
    };
    
    // Abre o modal para edição
    const handleEditClick = (vaga) => {
        setVagaParaEditar(vaga);
        setIsVagaModalOpen(true);
    };

    // Abre o modal para criar (limpando o estado de edição)
    const handleCreateClick = () => {
        setVagaParaEditar(null);
        setIsVagaModalOpen(true);
    };

    // Fecha o modal e limpa a vaga em edição
    const handleCloseModal = () => {
        setIsVagaModalOpen(false);
        setVagaParaEditar(null);
    };


    return (
        <div className="admin-page">
            <h1 className="admin-title">PAINEL DE CONTROLE</h1>
            
            <DashboardStats vagas={vagas} loading={loading} />

            <div className="admin-actions">
                <button className="action-button" onClick={handleCreateClick}>
                    <FontAwesomeIcon icon={faPlus} /> NOVA VAGA
                </button>
                <button className="action-button" onClick={() => setIsCursoModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> GERENCIAR CURSOS
                </button>
            </div>
            
            {loading && <p>Carregando lista de vagas...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
                <ListaVagasAdmin 
                    vagas={vagas} 
                    onSuccessRefresh={handleSuccess} 
                    onEdit={handleEditClick}
                />
            )}

            {/* Modal de Vaga (agora reutilizável para criar/editar) */}
            <Modal isOpen={isVagaModalOpen} onClose={handleCloseModal}>
                <FormularioVaga 
                    onClose={handleCloseModal} 
                    onSuccess={handleSuccess}
                    vagaParaEditar={vagaParaEditar}
                />
            </Modal>

            {/* Modal de Curso */}
            <Modal isOpen={isCursoModalOpen} onClose={() => setIsCursoModalOpen(false)}>
                <FormularioCurso onClose={() => setIsCursoModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdmCadastrar;