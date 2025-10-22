import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import '../Styles/AdmCadastrar.css';
import API_URL from '../apiConfig';


const cursoMap = {
    "Análise e Desenvolvimento de Sistemas": "ADS",
    "Desenvolvimento de Software Multiplataforma": "DSM",
    "Comércio Exterior": "COMEX",
    "Gestão de Recursos Humanos": "RH",
    "Gestão Empresarial": "GESTAO_EMPRESARIAL",
    "Polímeros": "POLIMEROS",
    "Logística": "LOGISTICA",
    "Desenvolvimento de Produtos Plásticos": "DPP"
};

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
    const [cursosSelecionados, setCursosSelecionados] = useState([]);
    const [error, setError] = useState('');

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

        try {
            const response = await fetch(`${API_URL}/vagas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vagaDTO),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao cadastrar vaga');
            }

            alert('Vaga cadastrada com sucesso!');
            onClose();
        } catch (err) {
            console.error("Erro ao cadastrar vaga:", err);
            setError(`Erro: ${err.message}`);
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
                <label>Data de Publicação <input type="date" name="dataPublicacao" value={formData.dataPublicacao} onChange={handleChange} required /></label>
            </div>

            <label>Benefícios (separados por vírgula) <textarea name="beneficios" value={formData.beneficios} onChange={handleChange} rows="3"></textarea></label>
            <label>Requisitos (separados por vírgula) <textarea name="requisitos" value={formData.requisitos} onChange={handleChange} rows="3"></textarea></label>
            <label>Diferenciais (separados por vírgula) <textarea name="diferenciais" value={formData.diferenciais} onChange={handleChange} rows="3"></textarea></label>
            <label>Responsabilidades (separadas por vírgula) <textarea name="responsabilidades" value={formData.responsabilidades} onChange={handleChange} rows="4"></textarea></label>
            
            <div className="form-group-cursos">
                <h4>Cursos Alvo (Selecione ao menos um)</h4>
                <div className="cursos-checkbox-container">
                    {Object.entries(cursoMap).map(([fullName, sigla]) => (
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

const AdmCadastrar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="admin-page">
            <h1 className="admin-title">PAINEL DE CADASTRO</h1>
            <div className="admin-actions">
                <button className="action-button" onClick={() => setIsModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} /> NOVA VAGA
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <FormularioVaga onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default AdmCadastrar;