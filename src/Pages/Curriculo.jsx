
import React, { useEffect, useRef } from 'react';
import '../Styles/Curriculo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenRuler, faInfoCircle, faExclamationTriangle, faEnvelope, faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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

    return <section ref={sectionRef} className={`curriculo-section ${className || ''}`}>{children}</section>;
};

const Curriculo = () => {
    return (
        <div className="curriculo-page">
            {/* --- Seção de Introdução --- */}
            <AnimatedSection className="curriculo-hero">
                <div className="section-container">
                    <h1 className="curriculo-title">Prepare seu Currículo</h1>
                    <p className="curriculo-subtitle">
                        Seu currículo é seu cartão de visitas, a primeira impressão que você causa. Ele precisa ser claro, profissional e destacar o seu potencial. Aqui na FATEC ZL, oferecemos as ferramentas e dicas para você criar um documento que abre portas.
                    </p>
                </div>
            </AnimatedSection>

            {/* --- Seção de Dicas --- */}
            <AnimatedSection className="dicas-section">
                <div className="section-container">
                    <h2 className="section-title">3 Dicas Essenciais</h2>
                    <div className="dicas-grid">
                        <div className="dica-card">
                            <FontAwesomeIcon icon={faPenRuler} className="dica-icon" />
                            <h3>1. Formatação Impecável</h3>
                            <p>Um layout limpo e organizado é fundamental. Use uma fonte profissional (como Calibri ou Arial), mantenha o texto legível e use negrito para destacar títulos. Evite excesso de cores e limite-se a uma, no máximo duas páginas.</p>
                        </div>
                        <div className="dica-card">
                            <FontAwesomeIcon icon={faInfoCircle} className="dica-icon" />
                            <h3>2. Informações Claras e Relevantes</h3>
                            <p>Comece com seus dados de contato visíveis. Crie um resumo profissional curto e impactante. Liste suas experiências da mais recente para a mais antiga, focando em suas responsabilidades e conquistas. Destaque habilidades técnicas e comportamentais relevantes para a vaga.</p>
                        </div>
                        <div className="dica-card">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="dica-icon" />
                            <h3>3. Atenção aos Detalhes</h3>
                            <p>Revise o documento várias vezes para eliminar qualquer erro de português. Peça para um colega ou professor ler também. Mantenha seu currículo sempre atualizado com novas experiências e cursos, adaptando-o para cada vaga que se candidatar.</p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* --- Estrutura de um Currículo de Sucesso --- */}
            <AnimatedSection className="estrutura-section">
                <div className="section-container">
                    <h2 className="section-title">Estrutura de um Currículo de Sucesso</h2>
                    <div className="estrutura-visual">
                        <div className="estrutura-item header">Cabeçalho (Nome e Contato)</div>
                        <div className="estrutura-item resumo">Resumo Profissional</div>
                        <div className="estrutura-item experiencia">Experiência Profissional</div>
                        <div className="estrutura-item formacao">Formação Acadêmica</div>
                        <div className="estrutura-item habilidades">Habilidades e Competências</div>
                        <div className="estrutura-item extra">Idiomas e Cursos Complementares</div>
                    </div>
                </div>
            </AnimatedSection>
            
            {/* ---  Erros Comuns a Evitar --- */}
            <AnimatedSection className="erros-section">
                <div className="section-container">
                    <h2 className="section-title">Erros Comuns a Evitar</h2>
                    <div className="erros-grid">
                        <div className="erro-card">
                            <FontAwesomeIcon icon={faTimesCircle} className="erro-icon" />
                            <h4>Informações de Contato Erradas</h4>
                            <p>Um simples dígito errado no telefone ou uma letra no e-mail pode te eliminar.</p>
                        </div>
                        <div className="erro-card">
                            <FontAwesomeIcon icon={faTimesCircle} className="erro-icon" />
                            <h4>Erros de Português</h4>
                            <p>Erros gramaticais e de digitação transmitem uma imagem de descuido e falta de atenção.</p>
                        </div>
                        <div className="erro-card">
                            <FontAwesomeIcon icon={faTimesCircle} className="erro-icon" />
                            <h4>Excesso de Páginas</h4>
                            <p>Recrutadores têm pouco tempo. Mantenha seu currículo conciso, com no máximo 2 páginas.</p>
                        </div>
                        <div className="erro-card">
                            <FontAwesomeIcon icon={faTimesCircle} className="erro-icon" />
                            <h4>Layout Desorganizado</h4>
                            <p>Poluição visual com muitas fontes, cores ou falta de padrão dificulta a leitura.</p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* --- Seção de Análise de Currículo --- */}
            <AnimatedSection className="analise-section">
                <div className="section-container">
                    <FontAwesomeIcon icon={faEnvelope} className="analise-icon" />
                    <h2 className="section-title">Receba uma Análise Profissional</h2>
                    <p className="section-description">
                        Quer uma opinião especializada? Utilize ferramentas online para otimizar seu currículo e aumentar suas chances de sucesso.
                    </p>
                    <a href="mailto:coloque-seu-email-aqui@exemplo.com?subject=Análise de Currículo" className="cta-button">Enviar para Análise</a>
                    <a href="https://www.canva.com/pt_br/criar/curriculo/" target="_blank" rel="noopener noreferrer" className="cta-button secondary">Criar no Canva</a>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default Curriculo;