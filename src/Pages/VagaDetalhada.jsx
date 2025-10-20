import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/VagaDetalhada.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../apiConfig';

const VagaDetalhada = () => {
    const { vagaId } = useParams();
    const [vaga, setVaga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
            <div className="vaga-card-detalhado">
                <p className="vaga-caminho">
                    <Link to="/">Mural de Estágios</Link> &gt; <Link to="/vagas">Vagas</Link> &gt; {vaga.titulo}
                </p>
                <h1 className="vaga-titulo-principal">{vaga.titulo}</h1>
                <h2 className="vaga-empresa">{vaga.empresa}</h2>

                <div className="vaga-info-geral">
                    <span>Período: {vaga.periodo || 'Não informado'}</span>
                    <span>Modelo: {vaga.modelo ? vaga.modelo.replace('_', ' ') : 'Não informado'}</span>
                    <span>Status: {vaga.statusVaga || 'Não informado'}</span>
                    <span>
                        Publicada em: {vaga.dataPublicacao ? new Date(vaga.dataPublicacao).toLocaleDateString() : 'Não informado'} <FontAwesomeIcon icon={faCalendarAlt} />
                    </span>
                </div>

                <div className="vaga-secao">
                    <h3>Remuneração</h3>
                    <p>{vaga.remuneracao || 'A combinar'}</p>
                </div>

                {vaga.beneficios && vaga.beneficios.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Benefícios</h3>
                        <ul>
                            {vaga.beneficios.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                )}

                {vaga.requisitos && vaga.requisitos.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Requisitos</h3>
                        <ul>
                            {vaga.requisitos.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                )}

                {vaga.diferenciais && vaga.diferenciais.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Diferenciais</h3>
                        <ul>
                            {vaga.diferenciais.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                )}

                {vaga.responsabilidades && vaga.responsabilidades.length > 0 && (
                    <div className="vaga-secao">
                        <h3>Responsabilidades</h3>
                        <ul>
                            {vaga.responsabilidades.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                )}
                
                <a href={vaga.link} target="_blank" rel="noopener noreferrer" className="ir-para-vaga-btn">
                    IR ATÉ A VAGA
                </a>
            </div>
        </div>
    );
};

export default VagaDetalhada;