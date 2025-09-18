import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
import '../Styles/AdmCadastrar.css';

// --- Componente do Popup (Modal) ---
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

// --- Formulário de Cadastro de Vaga (Estrutura Atualizada) ---
const FormularioVaga = () => (
    <form className="admin-form">
        <h2>Cadastrar Nova Vaga</h2>
        <div className="form-fields">
            <label>Empresa <input type="text" placeholder="Ex: Microsoft" /></label>
            <label>Vaga <input type="text" placeholder="Ex: Estágio em Desenvolvimento" /></label>
            <label>Salário <input type="text" placeholder="Ex: 2500, A combinar..." /></label>
            <label>Período (Horário) <input type="text" placeholder="Ex: 6 horas/dia" /></label>
            <label>Canal <input type="text" placeholder="Ex: Gupy, CIEE, etc" /></label>
            <label>Link <input type="url" placeholder="https://..." /></label>
            <label>Benefícios <input type="text" placeholder="Ex: Vale Refeição, Plano de Saúde" /></label>
            <label>Requisitos <input type="text" placeholder="Ex: Cursando ADS, Inglês" /></label>
            <label>Modelo <input type="text" placeholder="Ex: Híbrido" /></label>
            <label>Diferenciais <input type="text" placeholder="Ex: Plano de carreira" /></label>
        </div>

        <label>Responsabilidades <textarea rows="4" placeholder="Descreva as principais atividades..."></textarea></label>
        
        {/* Área de Upload movida para o final */}
        <label className="upload-area">
            <FontAwesomeIcon icon={faUpload} />
            <span>Insira a logo da empresa aqui</span>
            <input type="file" accept="image/*" style={{ display: 'none' }} />
        </label>
        
        <div className="form-row">
            <label>Data de Publicação <input type="date" /></label>
            <div className="toggle-switch">
                <span>Vaga Aberta</span>
                <input type="checkbox" id="vaga-aberta" className="switch-input" defaultChecked />
                <label htmlFor="vaga-aberta" className="switch-label"></label>
            </div>
        </div>
        <button type="submit" className="submit-button">CADASTRAR VAGA</button>
    </form>
);

// --- Formulário de Cadastro de Evento ---
const FormularioEvento = () => (
    <form className="admin-form">
        <h2>Cadastrar Novo Evento</h2>
        <div className="form-grid">
            <div className="form-left">
                <label>Título <input type="text" placeholder="Ex: Feira de Recrutamento" /></label>
                <label>Público <input type="text" placeholder="Ex: Alunos de ADS e DSM" /></label>
                <label>Descrição <textarea rows="4" placeholder="Descreva o evento..."></textarea></label>
                <div className="form-row-single">
                    <label>Data do Evento <input type="date" /></label>
                    <label>Horário <input type="time" /></label>
                </div>
            </div>
            <div className="form-right">
                <label className="upload-area">
                    <FontAwesomeIcon icon={faUpload} />
                    <span>Insira o banner aqui</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                </label>
            </div>
        </div>
        <div className="form-row">
             <div className="toggle-switch">
                <span>Evento Disponível</span>
                <input type="checkbox" id="evento-disponivel" className="switch-input" defaultChecked />
                <label htmlFor="evento-disponivel" className="switch-label"></label>
            </div>
        </div>
        <button type="submit" className="submit-button">CADASTRAR EVENTO</button>
    </form>
);


const AdmCadastrar = () => {
    const [modalAberto, setModalAberto] = useState(null);

    return (
        <div className="admin-page">
            <h1 className="admin-title">PAINEL DE CADASTRO</h1>

            <div className="admin-actions">
                <button className="action-button" onClick={() => setModalAberto('evento')}>
                    <FontAwesomeIcon icon={faPlus} /> NOVO EVENTO
                </button>
                <button className="action-button" onClick={() => setModalAberto('vaga')}>
                    <FontAwesomeIcon icon={faPlus} /> NOVA VAGA
                </button>
            </div>

            {/* --- Modais --- */}
            <Modal isOpen={modalAberto === 'vaga'} onClose={() => setModalAberto(null)}>
                <FormularioVaga />
            </Modal>
            
            <Modal isOpen={modalAberto === 'evento'} onClose={() => setModalAberto(null)}>
                <FormularioEvento />
            </Modal>
        </div>
    );
};

export default AdmCadastrar;