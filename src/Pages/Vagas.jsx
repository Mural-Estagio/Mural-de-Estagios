import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Vagas.css';
import API_URL from '../apiConfig'; // Importando a URL da API

// Mapa para traduzir nomes de cursos para as siglas da API
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

// Listas para os filtros
const cursosFiltro = Object.keys(cursoMap);
const habilidadesFiltro = ['Excel', 'Word', 'PowerPoint', 'Comunicação', 'Organização', 'Inglês Básico', 'Inglês Intermediário', 'Inglês Avançado', 'Espanhol', 'Programação', 'Java', 'Python', 'SQL', 'React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'API', 'Banco de Dados', 'Git', 'Cloud', 'SAP', 'Gestão de Projetos', 'Metodologias Ágeis'];

const JobCard = ({ vaga }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const link = `${window.location.origin}/vagas/${vaga.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <div className="job-card">
            <div className="card-header">
                <div className="card-title">
                    <h3>{vaga.titulo}</h3>
                    <p>{vaga.empresa}</p>
                    <p>{vaga.remuneracao || 'A combinar'}</p>
                </div>
                <div className="options-container">
                    <button className="options-btn" aria-label="Mais opções" onClick={handleShare}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {copied && <span className="copy-feedback">Link Copiado!</span>}
                </div>
            </div>
            <div className="card-body">
                <p><strong>Responsabilidades:</strong> {vaga.responsabilidades && vaga.responsabilidades.join(', ')}</p>
            </div>
            <div className="card-footer">
                <Link to={`/vagas/${vaga.id}`} className="confirm-button">Confira</Link>
                <span>{vaga.dataPublicacao ? new Date(vaga.dataPublicacao).toLocaleDateString() : ''}</span>
            </div>
        </div>
    );
};

const Vagas = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cursoSelecionado = queryParams.get("curso");

    const [vagas, setVagas] = useState([]); // Armazena as vagas vindas da API
    const [filteredVagas, setFilteredVagas] = useState([]); // Armazena as vagas após filtragem do cliente
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [filters, setFilters] = useState({
        searchTerm: '',
        shift: { manha: false, tarde: false, noite: false },
        salaryRange: [500, 9999],
        courses: cursoSelecionado ? [cursoSelecionado] : [],
        skills: []
    });

    // Efeito para buscar os dados da API
    useEffect(() => {
        const fetchVagas = async () => {
            setLoading(true);
            setError(null);
            
            let url = `${API_URL}/vagas`; // Endpoint padrão para buscar todas as vagas

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Falha ao buscar vagas da API');
                }
                const data = await response.json();
                setVagas(data); // Guarda os dados brutos da API
            } catch (error) {
                console.error("Erro ao buscar vagas:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVagas();
    }, []); // Executa apenas uma vez quando o componente monta

    // Efeito para aplicar os filtros sempre que 'vagas' ou 'filters' mudarem
    useEffect(() => {
        let vagasParaFiltrar = [...vagas];

        // Filtro por busca de texto (cliente)
        if (filters.searchTerm) {
            vagasParaFiltrar = vagasParaFiltrar.filter(vaga =>
                vaga.titulo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                vaga.empresa.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }

        // Filtro por curso (cliente)
        if (filters.courses.length > 0) {
            const cursosSiglas = filters.courses.map(fullName => cursoMap[fullName]);
            vagasParaFiltrar = vagasParaFiltrar.filter(vaga =>
                vaga.cursosAlvo && vaga.cursosAlvo.some(cursoApi => cursosSiglas.includes(cursoApi))
            );
        }

        // Filtros de turno, salário e habilidades (cliente)
        vagasParaFiltrar = vagasParaFiltrar.filter(vaga => {
            const { shift, salaryRange, skills } = filters;

            const shiftMatch = (!shift.manha && !shift.tarde && !shift.noite) ||
                               (shift.manha && vaga.periodo && vaga.periodo.toLowerCase().includes('manhã')) ||
                               (shift.tarde && vaga.periodo && vaga.periodo.toLowerCase().includes('tarde')) ||
                               (shift.noite && vaga.periodo && vaga.periodo.toLowerCase().includes('noite'));

            const [min, max] = salaryRange;
            const remuneracaoNumerica = vaga.remuneracao ? parseFloat(String(vaga.remuneracao).replace(/\D/g, '')) : 0;
            const salaryMatch = remuneracaoNumerica >= min && remuneracaoNumerica <= max;

            const skillsMatch = skills.length === 0 ||
                                skills.every(skill =>
                                    (vaga.requisitos && vaga.requisitos.some(req => req.toLowerCase().includes(skill.toLowerCase()))) ||
                                    (vaga.diferenciais && vaga.diferenciais.some(dif => dif.toLowerCase().includes(skill.toLowerCase())))
                                );

            return shiftMatch && salaryMatch && skillsMatch;
        });

        setFilteredVagas(vagasParaFiltrar);

    }, [vagas, filters]);


    const handleSalaryChange = (newRange) => {
        setFilters(prev => ({ ...prev, salaryRange: newRange }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (['manha', 'tarde', 'noite'].includes(name)) {
                setFilters(prev => ({ ...prev, shift: { ...prev.shift, [name]: checked } }));
            } else if (name === 'course') {
                const currentValues = filters.courses;
                const newCourses = checked ? [...currentValues, value] : currentValues.filter(item => item !== value);
                setFilters(prev => ({ ...prev, courses: newCourses }));
            } else if (name === 'skill') {
                const currentValues = filters.skills;
                const newSkills = checked ? [...currentValues, value] : currentValues.filter(item => item !== value);
                setFilters(prev => ({ ...prev, skills: newSkills }));
            }
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="vagas-page">
            <div className="vagas-header">
                <h1>Vagas de Estágio</h1>
            </div>

            <div className="vagas-container">
                <aside className="filter-sidebar">
                    <div className="filter-group">
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Busque por cargo ou empresa..."
                            className="search-input"
                            value={filters.searchTerm}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="filter-group">
                        <h4>Turno</h4>
                        <div className="checkbox-group">
                            <label><input type="checkbox" name="manha" checked={filters.shift.manha} onChange={handleInputChange} /> Manhã</label>
                            <label><input type="checkbox" name="tarde" checked={filters.shift.tarde} onChange={handleInputChange} /> Tarde</label>
                            <label><input type="checkbox" name="noite" checked={filters.shift.noite} onChange={handleInputChange} /> Noite</label>
                        </div>
                    </div>

                    <div className="filter-group">
                        <h4>Faixa Salarial</h4>
                        <div className="salary-slider-labels">
                            <span>Mínimo: R$ {filters.salaryRange[0]}</span>
                            <span>Máximo: R$ {filters.salaryRange[1] === 9999 ? '9999+' : filters.salaryRange[1]}</span>
                        </div>

                        <ReactSlider
                            className="salary-range-slider"
                            thumbClassName="slider-thumb"
                            trackClassName="slider-track"
                            min={500}
                            max={9999}
                            step={100}
                            value={filters.salaryRange}
                            onChange={handleSalaryChange}
                            pearling
                            minDistance={500}
                        />
                    </div>

                    <div className="filter-group">
                        <h4>Cursos</h4>
                        <div className="checkbox-group scrollable">
                            {cursosFiltro.map(curso => (
                                <label key={curso}>
                                    <input
                                        type="checkbox"
                                        name="course"
                                        value={curso}
                                        checked={filters.courses.includes(curso)}
                                        onChange={handleInputChange}
                                    /> {curso}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h4>Habilidades</h4>
                        <div className="checkbox-group scrollable">
                            {habilidadesFiltro.map(skill => (
                                <label key={skill}>
                                    <input
                                        type="checkbox"
                                        name="skill"
                                        value={skill}
                                        checked={filters.skills.includes(skill)}
                                        onChange={handleInputChange}
                                    /> {skill}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="job-listings">
                    {loading && <p>Carregando vagas...</p>}
                    {error && <p className="no-results">Erro ao carregar vagas: {error}</p>}
                    {!loading && !error && filteredVagas.length > 0 ? (
                        filteredVagas.map(vaga => <JobCard key={vaga.id} vaga={vaga} />)
                    ) : (
                        !loading && !error && <p className="no-results">Nenhuma vaga encontrada com os filtros selecionados.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Vagas;