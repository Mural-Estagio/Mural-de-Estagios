import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons'; // faUpload adicionado
import '../Styles/AdmCadastrar.css';
import { api } from '../Service/api';

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


// --- FORMULÁRIO DE CURSO (NOVO) ---
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


// --- FORMULÁRIO DE VAGA (MODIFICADO) ---
const FormularioVaga = ({ onClose }) => {
    const [formData, setFormData] = useState({
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
    });

    const [cursosDisponiveis, setCursosDisponiveis] = useState({});
    const [cursosSelecionados, setCursosSelecionados] = useState([]);
    const [file, setFile] = useState(null); // Estado para o arquivo
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

        const vagaDTO = {
            ...formData,
            beneficios: formData.beneficios.split(',').map(s => s.trim()).filter(Boolean),
            requisitos: formData.requisitos.split(',').map(s => s.trim()).filter(Boolean),
            diferenciais: formData.diferenciais.split(',').map(s => s.trim()).filter(Boolean),
            responsabilidades: formData.responsabilidades.split(',').map(s => s.trim()).filter(Boolean),
            cursosAlvo: cursosSelecionados,
        };

        // Criar FormData para enviar JSON + Arquivo
        const formDataToSend = new FormData();
        formDataToSend.append('vagaDTO', JSON.stringify(vagaDTO));
        
        if (file) {
            formDataToSend.append('file', file);
        }

        try {
            const response = await api.post('/vagas', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Header é definido automaticamente pelo axios com FormData
                },
            });

            if (!response || !response.data) {
                throw new Error('Resposta inválida do servidor.');
            }

            alert('✅ Vaga cadastrada com sucesso!');
            onClose();
        } catch (err) {
            console.error('Erro ao cadastrar vaga:', err);
            setError(err.response?.data?.message || err.message || 'Erro inesperado ao cadastrar vaga.');
        }
    };

    return (
        <form className="admin-form" onSubmit={handleSubmit}>
            <h2>Cadastrar Nova Vaga</h2>
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

            {/* CAMPO DE UPLOAD DE ARQUIVO */}
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


            <div className="form-group-cursos">
                <h4>Cursos Alvo (Selecione ao menos um)</h4>
                <div className="cursos-checkbox-container">
                    {Object.entries(cursosDisponiveis).map(([fullName, sigla]) => (
                        <label key={sigla} className="curso-checkbox">
                            <input type="checkbox" value={sigla} onChange={handleCursoChange} /> {fullName}
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" className="submit-button">CADASTRAR VAGA</button>
        </form>
    );
};


// --- COMPONENTE PRINCIPAL (MODIFICADO) ---
const AdmCadastrar = () => {
    const [isVagaModalOpen, setIsVagaModalOpen] = useState(false);
    const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);

    return (
        <div className="admin-page">
            <h1 className="admin-title">PAINEL DE CADASTRO</h1>
            <div className="admin-actions">
                <button className="action-button" onClick={() => setIsVagaModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> NOVA VAGA
                </button>
                <button className="action-button" onClick={() => setIsCursoModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> GERENCIAR CURSOS
                </button>
            </div>

            <Modal isOpen={isVagaModalOpen} onClose={() => setIsVagaModalOpen(false)}>
                <FormularioVaga onClose={() => setIsVagaModalOpen(false)} />
            </Modal>

            <Modal isOpen={isCursoModalOpen} onClose={() => setIsCursoModalOpen(false)}>
                <FormularioCurso onClose={() => setIsCursoModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdmCadastrar;