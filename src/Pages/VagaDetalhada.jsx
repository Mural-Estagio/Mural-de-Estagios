import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/VagaDetalhada.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPrint, faQrcode } from '@fortawesome/free-solid-svg-icons'; 
import API_URL from '../apiConfig';
import { QRCodeCanvas } from 'qrcode.react'; 

const VagaDetalhada = () => {
    const { vagaId } = useParams();
    const [vaga, setVaga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUrl, setCurrentUrl] = useState(''); 

    useEffect(() => {
        setCurrentUrl(window.location.href);

        const fetchVagaDetalhada = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/vagas/${vagaId}`);
                if (!response.ok) {
                    throw new Error('Vaga não encontrada ou falha na requisição');
                }
                const data = await response.json();
                setVaga(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVagaDetalhada();
    }, [vagaId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <div className="vaga-detalhada-page"><p>Carregando detalhes da vaga...</p></div>;
    }

    if (error) {
        return <div className="vaga-detalhada-page"><p className="error-message">Erro: {error}</p></div>;
    }

    if (!vaga) {
        return <div className="vaga-detalhada-page"><p>Vaga não encontrada.</p></div>;
    }

    return (
        <div className="vaga-detalhada-page">
            <div id="vaga-para-imprimir" className="vaga-card-detalhado">
                <div className="print-header">
                    <img src="/src/Assets/fatec_logo.png" alt="Logo Fatec Zona Leste" className="print-logo" />
                    <h2>Detalhes da Vaga de Estágio</h2>
                </div>

                <p className="vaga-caminho no-print">
                    <Link to="/">Mural de Estágios</Link> &gt; <Link to="/vagas">Vagas</Link> &gt; {vaga.titulo}
                </p>

                <h1 className="vaga-titulo-principal">{vaga.titulo}</h1>
                <h2 className="vaga-empresa">{vaga.empresa}</h2>

                <div className="vaga-info-geral">
                    <span>Período: {vaga.periodo || 'Não informado'}</span>
                    <span>Modelo: {vaga.modelo ? vaga.modelo.replace('_', ' ') : 'Não informado'}</span>
                    <span>Status: {vaga.statusVaga || 'Não informado'}</span>
                    <span>
                        Publicada em: {vaga.dataPublicacao ? new Date(vaga.dataPublicacao).toLocaleDateString() : 'Não informado'} <FontAwesomeIcon icon={faCalendarAlt} className="no-print" />
                    </span>
                </div>

                <div className="vaga-secao">
                    <h3>Remuneração</h3>
                    <p>{vaga.remuneração || 'A combinar'}</p>
                </div>

                {vaga.beneficios && vaga.beneficios.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Benefícios</h3>
                        <ul>{vaga.beneficios.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}
                 {vaga.requisitos && vaga.requisitos.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Requisitos</h3>
                        <ul>{vaga.requisitos.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}
                 {vaga.diferenciais && vaga.diferenciais.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Diferenciais</h3>
                        <ul>{vaga.diferenciais.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}
                 {vaga.responsabilidades && vaga.responsabilidades.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Responsabilidades</h3>
                        <ul>{vaga.responsabilidades.map((item, index) => <li key={index}>{item}</li>)}</ul>
                    </div>
                )}

                <div className="print-footer">
                    <div className="qr-code-container-print">
                        <QRCodeCanvas value={currentUrl} size={100} />
                        <p>Acesse online</p>
                    </div>
                     <p className="print-link">Link: {currentUrl}</p>
                     <p className="print-info-fatec">Mural de Estágios - Fatec Zona Leste</p>
                </div>

                <div className="vaga-actions no-print">
                    <button onClick={handlePrint} className="print-button">
                        <FontAwesomeIcon icon={faPrint} /> Imprimir Vaga
                    </button>
                    <a href={vaga.link} target="_blank" rel="noopener noreferrer" className="ir-para-vaga-btn">
                        IR ATÉ A VAGA (Online)
                    </a>
                    <div className="qr-code-container-screen">
                        <h4>Link da Vaga (QR Code):</h4>
                        {currentUrl && <QRCodeCanvas value={currentUrl} size={128} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VagaDetalhada;