import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';

// Importação dos estilos do carrossel e da página
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Styles/HomePage.css';

// Importação dos ícones
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileSignature, faFileAlt, faArrowRight,
    faGraduationCap, faBriefcase, faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';

const imageModules = import.meta.glob('../Assets/HomeImages/*.{jpg,jpeg,png,gif}', { eager: true });
const homeImages = Object.values(imageModules).map(mod => mod.default);

/**
 * Componente reutilizável que aplica uma animação de fade-in
 * quando a seção se torna visível na tela.
 */
const AnimatedSection = ({ children, className }) => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Opcional: animar apenas uma vez
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section ref={sectionRef} className={`home-section ${className || ''}`}>
            {children}
        </section>
    );
};

const HomePage = () => {
    const courses = [
        "Análise e Desenvolvimento de Sistemas", "Desenvolvimento de Software Multiplataforma",
        "Comércio Exterior", "Gestão de Recursos Humanos", "Gestão Empresarial",
        "Polímeros", "Logística", "Desenvolvimento de Produtos Plásticos"
    ];

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } }
        ]
    };

    return (
        <div className="homepage-container">
            {/* --- Seção Hero --- */}
            <AnimatedSection className="hero-section">
                <div className="hero-carousel-wrapper">
                    <Slider
                        dots={false}
                        infinite={true}
                        speed={1000}
                        slidesToShow={1}
                        slidesToScroll={1}
                        autoplay={true}
                        autoplaySpeed={4000}
                        fade={true}
                        arrows={false}
                        className="hero-carousel"
                    >
                        {homeImages.map((src, index) => (
                            <div key={index} className="hero-slide">
                                <img src={src} alt={`Slide ${index + 1}`} className="hero-image" />
                            </div>
                        ))}
                    </Slider>
                </div>
                <div className="section-container hero-overlay">
                    <h1 className="hero-title">Mural de Estágios</h1>
                    <p className="hero-subtitle">Fatec Zona Leste: Inspirar, Educar, Transformar.</p>
                </div>
            </AnimatedSection>

            <AnimatedSection className="courses-section">
                <div className="section-container">
                    <div className="course-cards-grid">
                        {courses.map(course => (
                            <a
                                href={`/vagas?curso=${encodeURIComponent(course)}`}
                                key={course}
                                className="course-card"
                            >
                                <h3>{course}</h3>
                                <span>Vagas <FontAwesomeIcon icon={faArrowRight} /></span>
                            </a>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* --- Seção "Por que a Fatec ZL?" --- */}
            <AnimatedSection className="why-fatec-section">
                <div className="section-container">
                    <h2 className="section-title">Por que a Fatec ZL?</h2>
                    <p className="section-description">
                        Descubra os diferenciais que fazem da nossa instituição a escolha certa para o seu futuro profissional.
                    </p>
                    <div className="features-grid">
                        <div className="feature-card">
                            <FontAwesomeIcon icon={faGraduationCap} className="feature-icon" />
                            <h3>Ensino Gratuito e de Qualidade</h3>
                            <p>Educação superior pública, gratuita e reconhecida pela excelência acadêmica e foco no mercado.</p>
                        </div>
                        <div className="feature-card">
                            <FontAwesomeIcon icon={faBriefcase} className="feature-icon" />
                            <h3>Alta Empregabilidade</h3>
                            <p>Nossos alunos são altamente requisitados pelo mercado, com altos índices de inserção profissional.</p>
                        </div>
                        <div className="feature-card">
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="feature-icon" />
                            <h3>Corpo Docente Qualificado</h3>
                            <p>Professores mestres e doutores com vasta experiência acadêmica e profissional.</p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* --- Seção de Eventos --- */}
            <AnimatedSection className="events-section">
                <div className="section-container">
                    <h2 className="section-title">Eventos</h2>
                    <p className="section-description">
                        Fique por dentro de tudo que acontece na Fatec Zona Leste,
                        dos eventos acadêmicos às oportunidades do mural de estágios.
                    </p>
                </div>
                <Slider {...carouselSettings} className="events-carousel">
                    <div className="event-banner placeholder-1"><h3>Feira de Recrutamento</h3></div>
                    <div className="event-banner placeholder-2"><h3>Palestra: O Futuro da IA</h3></div>
                    <div className="event-banner placeholder-3"><h3>Workshop de LinkedIn</h3></div>
                    <div className="event-banner placeholder-4"><h3>Semana de Tecnologia</h3></div>
                </Slider>
            </AnimatedSection>

            {/* --- Seção de Currículos --- */}
            <AnimatedSection className="resumes-section">
                <div className="section-container resume-container-flex">
                    <div className="resume-visual" style={{
                        backgroundImage: `url('https://www.catho.com.br/carreira-sucesso/wp-content/uploads/sites/3/2021/12/criatividade-1-1024x576.jpg')`
                    }}>
                    </div>
                    <div className="resume-content">
                        <h2 className="section-title">Currículos</h2>
                        <p className="section-subtitle">Destaque-se no Mercado de Trabalho</p>
                        <p className="section-description">
                            Aprenda a criar um currículo que chama a atenção dos recrutadores.
                            Confira nossas dicas exclusivas e análises para melhorar suas chances em vagas e estágios.
                        </p>
                        <a href="/curriculo" className="cta-button">Ver Dicas e Análises</a>
                    </div>
                </div>
            </AnimatedSection>

            {/* --- Seção de Documentos --- */}
            <AnimatedSection className="documents-section">
                <div className="section-container">
                    <h2 className="section-title">Documentos</h2>
                    <div className="document-options">
                        <a href="/documentos-obrigatorios" className="document-card">
                            <FontAwesomeIcon icon={faFileSignature} className="document-icon" />
                            <h3>Estágio Obrigatório</h3>
                        </a>
                        <a href="/documentos-nao-obrigatorios" className="document-card">
                            <FontAwesomeIcon icon={faFileAlt} className="document-icon" />
                            <h3>Estágio Não Obrigatório</h3>
                        </a>
                    </div>
                    <p className="section-description">
                        O estágio, obrigatório ou não, permite ao aluno aplicar os conhecimentos do curso e ganhar experiência profissional.
                        Consulte todos os documentos para conhecer as regras e procedimentos do estágio.
                    </p>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default HomePage;