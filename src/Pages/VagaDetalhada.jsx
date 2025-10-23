import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/VagaDetalhada.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt, faPrint, faMoneyBillWave,
    faClock, faMapMarkerAlt, faBriefcase, faBuilding, faListCheck,
    faStar, faAward, faUsers, faExternalLinkAlt, faArrowLeft 
} from '@fortawesome/free-solid-svg-icons';
import { api } from '../Service/api';
import { QRCodeCanvas } from 'qrcode.react';

const cursoMap = {
    "ADS": "Análise e Desenvolvimento de Sistemas",
    "DSM": "Desenvolvimento de Software Multiplataforma",
    "COMEX": "Comércio Exterior",
    "RH": "Gestão de Recursos Humanos",
    "GESTAO_EMPRESARIAL": "Gestão Empresarial",
    "POLIMEROS": "Polímeros",
    "LOGISTICA": "Logística",
    "DPP": "Desenvolvimento de Produtos Plásticos"
};

const VagaDetalhada = () => {
    const { vagaId } = useParams();
    const [vaga, setVaga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }

        const fetchVagaDetalhada = async () => {
            setLoading(true);
            try {
                // Faz a requisição usando axios
                const response = await api.get(`/vagas/${vagaId}`);

                if (!response.data) {
                    throw new Error('Vaga não encontrada ou sem dados disponíveis');
                }

                setVaga(response.data);
            } catch (err) {
                console.error('Erro ao buscar vaga:', err);
                setError(err.response?.data?.message || err.message || 'Erro inesperado');
            } finally {
                setLoading(false);
            }
        };

        fetchVagaDetalhada();
    }, [vagaId]);

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const getModeloInfo = (modelo) => {
        switch (modelo) {
            case 'HOME_OFFICE': return { icon: faBriefcase, text: 'Home Office' };
            case 'HIBRIDO': return { icon: faBuilding, text: 'Híbrido' };
            case 'PRESENCIAL': return { icon: faMapMarkerAlt, text: 'Presencial' };
            default: return { icon: faMapMarkerAlt, text: modelo || 'Não informado' };
        }
    };

    if (loading) {
        return (
            <div className="vaga-detalhada-page">
                <p className="loading-message">Carregando detalhes da vaga...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="vaga-detalhada-page">
                <p className="error-message">Erro: {error}</p>
            </div>
        );
    }

    if (!vaga) {
        return (
            <div className="vaga-detalhada-page">
                <p className="no-results">Vaga não encontrada.</p>
            </div>
        );
    }

    const modeloInfo = getModeloInfo(vaga.modelo);

    return (
        <div className="vaga-detalhada-page">
            <div id="vaga-para-imprimir" className="vaga-card-detalhado">
                <div className="print-header print-only">
                    <img src="/fatec_logo.png" alt="Logo Fatec Zona Leste" className="print-logo" />
                    <h2>Mural de Estágios - Detalhes da Vaga</h2>
                </div>

                <Link to="/vagas" className="back-link no-print">
                    <FontAwesomeIcon icon={faArrowLeft} /> Voltar para Vagas
                </Link>

                {/* --- CABEÇALHO PRINCIPAL DA VAGA --- */}
                <div className="card-header-info">
                    <h1 className="vaga-titulo-principal">{vaga.titulo}</h1>
                    <h2 className="vaga-empresa">{vaga.empresa}</h2>
                    <div className="vaga-info-geral">
                        <span title="Remuneração">
                            <FontAwesomeIcon icon={faMoneyBillWave} /> {vaga.remuneracao || 'A combinar'}
                        </span>
                        <span title="Modelo de Trabalho">
                            <FontAwesomeIcon icon={modeloInfo.icon} /> {modeloInfo.text}
                        </span>
                        {vaga.periodo && (
                            <span title="Período/Horário">
                                <FontAwesomeIcon icon={faClock} /> {vaga.periodo}
                            </span>
                        )}
                        <span title="Data de Publicação">
                            <FontAwesomeIcon icon={faCalendarAlt} /> Publicado em: {vaga.dataPublicacao ? new Date(vaga.dataPublicacao).toLocaleDateString('pt-BR') : 'N/D'}
                        </span>
                    </div>
                    {/* Botão de Candidatura no Cabeçalho */}
                    <a href={vaga.link} target="_blank" rel="noopener noreferrer" className="apply-button-header no-print">
                        Candidatar-se <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                </div>

                {/* --- Seções de Detalhes --- */}
                {vaga.responsabilidades?.length > 0 && (
                    <div className="vaga-secao">
                        <h3><FontAwesomeIcon icon={faListCheck} /> Responsabilidades</h3>
                        <ul>{vaga.responsabilidades.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}
                {vaga.requisitos?.length > 0 && (
                    <div className="vaga-secao">
                        <h3><FontAwesomeIcon icon={faStar} /> Requisitos</h3>
                        <ul>{vaga.requisitos.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}
                {vaga.beneficios?.length > 0 && (
                    <div className="vaga-secao">
                        <h3><FontAwesomeIcon icon={faAward} /> Benefícios</h3>
                        <ul>{vaga.beneficios.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}
                {vaga.diferenciais?.length > 0 && (
                    <div className="vaga-secao">
                        <h3><FontAwesomeIcon icon={faUsers} /> Diferenciais</h3>
                        <ul>{vaga.diferenciais.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}

                {/* --- Cursos Alvo --- */}
                {vaga.cursosAlvo?.length > 0 && (
                    <div className="vaga-secao print-only">
                        <h3>Cursos Alvo</h3>
                        <p>
                            {vaga.cursosAlvo.map(sigla => cursoMap[sigla] || sigla).join(', ')}
                        </p>
                    </div>
                )}

                {/* --- Rodapé para Impressão --- */}
                <div className="print-footer print-only">
                    <div className="qr-code-container-print">
                        {currentUrl && <QRCodeCanvas value={currentUrl} size={70} level="M" />}
                        <p>Acesse online</p>
                    </div>
                    <p className="print-link"><b>Link:</b> {currentUrl}</p>
                    <p className="print-info-fatec">Mural de Estágios - Fatec Zona Leste</p>
                </div>

                {/* --- Botões de Ação --- */}
                <div className="vaga-actions no-print">
                    <button onClick={handlePrint} className="ir-para-vaga-btn secondary">
                        <FontAwesomeIcon icon={faPrint} /> Imprimir / Salvar PDF
                    </button>
                    <div className="qr-code-container-screen">
                        <h4>Compartilhe esta vaga (QR Code):</h4>
                        {currentUrl && <QRCodeCanvas value={currentUrl} size={110} level="M" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VagaDetalhada;
