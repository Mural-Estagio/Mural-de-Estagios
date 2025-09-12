// src/Pages/VagaDetalhada.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/VagaDetalhada.css'; // Novo arquivo de estilo que vamos criar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// --- DADOS FICTÍCIOS (MOCK DATA) ---
// No futuro, você usaria o `id` da vaga para buscar estas informações em um banco de dados.
// Por enquanto, usaremos este exemplo fixo.
const vagaExemplo = {
    id: 1,
    title: 'Estágio em Desenvolvimento Front-End',
    empresa: 'TechSolutions LTDA',
    periodo: 'Segunda a Sexta — 10h às 16h',
    modelo: 'Híbrido',
    link: 'https://www.linkedin.com/jobs/',
    status: 'Aberta',
    publicadaEm: '05/09/2025',
    remuneracao: 'R$ 1.500,00 (Bolsa-auxílio)',
    beneficios: [
        'Vale Transporte',
        'Vale Refeição',
        'Day-off no aniversário',
        'Acesso a plataforma de cursos online',
    ],
    requisitos: [
        'Estar cursando Ciência da Computação, Sistemas de Informação ou áreas correlatas',
        'Conhecimentos em HTML, CSS e JavaScript',
        'Noções básicas de React',
        'Boa comunicação e proatividade',
    ],
    diferenciais: [
        'Conhecimento em TypeScript',
        'Experiência com Git/GitHub',
        'Participação em projetos de código aberto',
        'Inglês intermediário',
    ],
    responsabilidades: [
        'Auxiliar no desenvolvimento e manutenção de aplicações web',
        'Implementar interfaces responsivas em conjunto com o time de design',
        'Realizar testes básicos de funcionalidade',
        'Documentar processos e melhorias no código',
        'Participar de reuniões semanais de alinhamento',
    ]
};

const VagaDetalhada = () => {
    // No futuro, usaríamos o `useParams` para pegar o ID da URL e buscar a vaga
    // const { vagaId } = useParams();
    // Por enquanto, apenas exibimos a vaga de exemplo
    const vaga = vagaExemplo;

    return (
        <div className="vaga-detalhada-page">
            <div className="vaga-card-detalhado">
                <p className="vaga-caminho">
                    <Link to="/">Mural de Estágios</Link> &gt; <Link to="/vagas">Vagas</Link> &gt; {vaga.title}
                </p>
                <h1 className="vaga-titulo-principal">{vaga.title}</h1>
                <h2 className="vaga-empresa">{vaga.empresa}</h2>

                <div className="vaga-info-geral">
                    <span>Período: {vaga.periodo}</span>
                    <span>Modelo: {vaga.modelo}</span>
                    <span>Status: {vaga.status}</span>
                    <span>
                        Publicada em: {vaga.publicadaEm} <FontAwesomeIcon icon={faCalendarAlt} />
                    </span>
                </div>

                <div className="vaga-secao">
                    <h3>Remuneração</h3>
                    <p>{vaga.remuneracao}</p>
                </div>
                
                <div className="vaga-secao">
                    <h3>Benefícios</h3>
                    <ul>
                        {vaga.beneficios.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
                
                <div className="vaga-secao">
                    <h3>Requisitos</h3>
                    <ul>
                        {vaga.requisitos.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
                
                <div className="vaga-secao">
                    <h3>Diferenciais</h3>
                    <ul>
                        {vaga.diferenciais.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>

                <div className="vaga-secao">
                    <h3>Responsabilidades</h3>
                    <ul>
                        {vaga.responsabilidades.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
                
                <a href={vaga.link} target="_blank" rel="noopener noreferrer" className="ir-para-vaga-btn">
                    IR ATÉ A VAGA
                </a>
            </div>
        </div>
    );
};

export default VagaDetalhada;