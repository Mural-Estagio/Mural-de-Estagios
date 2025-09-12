import React, { useEffect, useRef } from 'react';
import '../Styles/Documentos.css'; // Novo arquivo de estilo que vamos criar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faEnvelope } from '@fortawesome/free-solid-svg-icons';

// Componente reutilizável para animar seções ao rolar a página
const AnimatedSection = ({ children, className }) => {
    const sectionRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 }
        );
        const currentRef = sectionRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, []);
    return <section ref={sectionRef} className={`documentos-section ${className || ''}`}>{children}</section>;
};

const Documentos = () => {
    // Listas de documentos para cada tipo de estágio
    const estagioObrigatorioDocs = [
        { nome: 'Fluxograma', subtitulo: 'Estágio Obrigatório', link: './Documentos/Fluxograma Estágio Obrigatório.pdf' },
        { nome: 'Cronograma', subtitulo: 'Estágio Obrigatório', link: '/Documentos/Cronograma Estágio 20222.docx' },
        { nome: 'Requerimento', subtitulo: 'Estágio Supervisionado', link: '/Documentos/Requerimento.docx' },
        { nome: 'Regulamento', subtitulo: 'Estágio Supervisionado', link: '/Documentos/Regulamento de Estágio supervisionado 20222.docx' },
        { nome: 'Anexo I', subtitulo: 'Estágio Remunerado', link: '/Documentos/Anexo I Relatorio de Estágio Supervisionado 20222.docx' },
        { nome: 'Anexo II', subtitulo: 'CLT, Autônomo, etc.', link: '/Documentos/Anexo II Relatório de Prática Profissional 20222.docx' },
        { nome: 'Anexo III', subtitulo: 'Estágio Não Remunerado', link: '/Documentos/Anexo III Relatório de Estágio Voluntário 20222.docx' },
    ];
    const estagioNaoObrigatorioDocs = [
        { nome: 'Fluxograma', subtitulo: 'Estágio Não Obrigatório', link: '/Documentos/Fluxograma Estágio não Obrigatório .pdf' },
        { nome: 'Termo de Compromisso', subtitulo: '', link: '/Documentos/ termo de compromisso de estagio 20202.docx' },
        { nome: 'Aditivo do Termo', subtitulo: 'de Compromisso', link: '/Documentos/Aditivo do Termo de Compromisso de Estágio 20202.docx' },
        { nome: 'Termo de Rescisão', subtitulo: 'do TCE', link: '/Documentos/Rescisão do TCE - 2019 atual.docx' },
        { nome: 'Convênio de Concessão', subtitulo: 'do Estágio', link: '/Documentos/convenio de concessao de estagio 20221.docx' },
    ];

    return (
        <div className="documentos-page">
            <AnimatedSection className="documentos-hero">
                <div className="section-container">
                    <h1 className="documentos-title">Documentos de Estágio</h1>
                    <p className="documentos-subtitle">
                        O relatório de estágio é uma peça fundamental no seu processo, registrando suas atividades e comprovando sua atuação na empresa. Ele também serve como uma ferramenta de avaliação e pode ser um grande diferencial em futuras oportunidades.
                    </p>
                </div>
            </AnimatedSection>

            {/* --- Seção Estágio Obrigatório --- */}
            <AnimatedSection>
                <div className="section-container">
                    <h2 className="section-title">Para o Estágio Obrigatório</h2>
                    <p className="section-warning">Antes de realizar o download, atente-se à modalidade do seu estágio!</p>
                    <div className="docs-grid">
                        {estagioObrigatorioDocs.map((doc, index) => (
                            <a href={doc.link} download key={index} className="doc-card">
                                <FontAwesomeIcon icon={faFileDownload} className="doc-icon" />
                                <h3>{doc.nome}</h3>
                                <p>{doc.subtitulo}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </AnimatedSection>
            
            {/* --- Seção Estágio Não Obrigatório --- */}
            <AnimatedSection>
                <div className="section-container">
                    <h2 className="section-title">Para o Estágio Não Obrigatório</h2>
                    <p className="section-warning">Antes de realizar o download, atente-se à modalidade do seu estágio!</p>
                    <div className="docs-grid">
                        {estagioNaoObrigatorioDocs.map((doc, index) => (
                            <a href={doc.link} download key={index} className="doc-card">
                                <FontAwesomeIcon icon={faFileDownload} className="doc-icon" />
                                <h3>{doc.nome}</h3>
                                <p>{doc.subtitulo}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* --- Seção de Contato --- */}
            <AnimatedSection className="contato-section">
                <div className="section-container">
                    <FontAwesomeIcon icon={faEnvelope} className="contato-icon" />
                    <h2 className="section-title">Informações e Dúvidas</h2>
                    <p className="section-description">
                        Este documento é a forma mais clara de registrar as atividades desenvolvidas, permitindo que você e seu supervisor avaliem o progresso e identifiquem oportunidades de melhoria.
                    </p>
                    <p className="contato-email">
                        Para mais dúvidas, entre em contato com o setor de estágio:
                        <a href="mailto:f111.estagio@fatec.sp.gov.br">f111.estagio@fatec.sp.gov.br</a>
                    </p>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default Documentos;

