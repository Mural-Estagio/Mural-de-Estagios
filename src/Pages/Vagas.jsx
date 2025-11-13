import React, { useState, useEffect } from 'react';
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding, faClock, faMoneyBillWave,
    faMapMarkerAlt, faBriefcase, faShareAlt 
} from '@fortawesome/free-solid-svg-icons';
import '../Styles/Vagas.css'; 
import { api } from '../Service/api';
const JobCard = ({ vaga }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = (e) => {
        e.stopPropagation();
        const link = `${window.location.origin}/vagas/${vaga.id}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Erro ao copiar link:', err));
    };

    const getModeloInfo = (modelo) => {
        switch (modelo) {
            case 'HOME_OFFICE': return { icon: faBriefcase, text: 'Home Office' };
            case 'HIBRIDO': return { icon: faBuilding, text: 'Híbrido' };
            case 'PRESENCIAL': return { icon: faMapMarkerAlt, text: 'Presencial' };
            default: return { icon: faMapMarkerAlt, text: modelo || 'Não informado' };
        }
    };

    const modeloInfo = getModeloInfo(vaga.modelo);

    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(/\s+/);
        if (words.length > 1) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        } else if (words.length === 1 && words[0].length > 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return name[0]?.toUpperCase() || '?';
    };

    return (
        <Link to={`/vagas/${vaga.id}`} className="job-card-link">
            <div className="job-card">
                <div className="card-header">
                    <div className="company-logo-placeholder">
                        <span>{getInitials(vaga.empresa)}</span>
                    </div>
                    <div className="card-title">
                        <h3>{vaga.titulo}</h3>
                        <p className="card-company">{vaga.empresa}</p>
                    </div>
                    <div className="options-container">
                        <button
                            className="options-btn share-btn"
                            aria-label="Partilhar vaga"
                            onClick={handleShare}
                            title="Copiar link da vaga"
                        >
                            <FontAwesomeIcon icon={faShareAlt} />
                        </button>
                        {copied && <span className="copy-feedback">Link Copiado!</span>}
                    </div>
                </div>

                <div className="job-info">
                    <div className="info-item" title="Remuneração">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                        <span>{vaga.remuneracao || 'A combinar'}</span>
                    </div>
                    <div className="info-item" title="Modelo de Trabalho">
                        <FontAwesomeIcon icon={modeloInfo.icon} />
                        <span>{modeloInfo.text}</span>
                    </div>
                    {vaga.periodo && (
                        <div className="info-item" title="Período/Horário">
                            <FontAwesomeIcon icon={faClock} />
                            <span>{vaga.periodo}</span>
                        </div>
                    )}
                </div>

                <div className="card-body">
                    {vaga.responsabilidades?.length > 0 && (
                        <p>
                            {vaga.responsabilidades.join(', ').length > 150
                                ? `${vaga.responsabilidades.join(', ').substring(0, 150)}...`
                                : vaga.responsabilidades.join(', ')
                            }
                        </p>
                    )}
                </div>

                <div className="card-footer">
                    <span className="card-date">
                        Publicado em: {vaga.dataPublicacao
                            ? new Date(vaga.dataPublicacao).toLocaleDateString('pt-BR')
                            : 'N/D'}
                    </span>
                </div>
            </div>
        </Link>
    );
};


const habilidadesFiltro = [
    'Excel', 'Word', 'PowerPoint', 'Comunicação', 'Organização',
    'Inglês Básico', 'Inglês Intermediário', 'Inglês Avançado', 'Espanhol',
    'Programação', 'Java', 'Python', 'SQL', 'React', 'JavaScript',
    'HTML', 'CSS', 'Node.js', 'API', 'Banco de Dados', 'Git',
    'Cloud', 'SAP', 'Gestão de Projetos', 'Metodologias Ágeis'
];

const Vagas = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cursoSelecionado = queryParams.get("curso");
    const headerSearchTerm = location.state?.headerSearch; 
    const [vagas, setVagas] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cursoMap, setCursoMap] = useState({});
    const [cursosFiltro, setCursosFiltro] = useState([]);

    const [filters, setFilters] = useState({
        searchTerm: headerSearchTerm || '', 
        shift: { manha: false, tarde: false, noite: false },
        modelo: { presencial: false, hibrido: false, home_office: false },
        courses: cursoSelecionado ? [cursoSelecionado] : [],
        skills: [] 
    });

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await api.get('/cursos');
                const cursos = response.data;
                const map = {};
                const filtro = [];
                cursos.forEach(curso => {
                    map[curso.nomeCompleto] = curso.sigla; 
                    filtro.push(curso.nomeCompleto);
                });
                setCursoMap(map);
                setCursosFiltro(filtro);
            } catch (err) {
                console.error("Erro ao buscar cursos:", err);
            }
        };
        fetchCursos();
    }, []);

    useEffect(() => {
        if (cursosFiltro.length === 0 && cursoSelecionado) {
            return;
        }

        const fetchVagasFiltradas = async () => {
            setLoading(true);
            setError(null);
            const params = {
                termo: filters.searchTerm.trim() || null,
                cursos: filters.courses.map(fullName => cursoMap[fullName]).filter(Boolean),
                modelos: Object.keys(filters.modelo)
                    .filter(k => filters.modelo[k])
                    .map(m => m.toUpperCase()), 
                
                periodos: Object.keys(filters.shift)
                    .filter(k => filters.shift[k])
            };
           
            if (params.cursos.length === 0) delete params.cursos;
            if (params.modelos.length === 0) delete params.modelos;
            if (params.periodos.length === 0) delete params.periodos;

            try {
                const response = await api.get('/vagas', { params });
                if (!response.data) throw new Error('Nenhuma vaga encontrada');
                let vagasFiltradas = response.data;
                const { skills } = filters;
                if (skills.length > 0) {
                     vagasFiltradas = vagasFiltradas.filter(vaga =>
                        skills.every(skill =>
                            vaga.requisitos?.some(req => req.toLowerCase().includes(skill.toLowerCase())) ||
                            vaga.diferenciais?.some(dif => dif.toLowerCase().includes(skill.toLowerCase()))
                        )
                    );
                }
                
                setVagas(vagasFiltradas);

            } catch (error) {
                console.error("Erro ao buscar vagas filtradas:", error);
                setError(error.response?.data?.message || error.message || 'Erro ao carregar vagas');
            } finally {
                setLoading(false);
            }
        };

        fetchVagasFiltradas();
        
    }, [filters, cursoMap, cursosFiltro.length, cursoSelecionado]); 

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (['manha', 'tarde', 'noite'].includes(name)) {
                setFilters(prev => ({ ...prev, shift: { ...prev.shift, [name]: checked } }));
            } else if (['presencial', 'hibrido', 'home_office'].includes(name)) { 
                setFilters(prev => ({ ...prev, modelo: { ...prev.modelo, [name]: checked } }));
            } else if (name === 'course') {
                const newCourses = checked
                    ? [...filters.courses, value]
                    : filters.courses.filter(item => item !== value);
                setFilters(prev => ({ ...prev, courses: newCourses }));
            } else if (name === 'skill') {
                const newSkills = checked
                    ? [...filters.skills, value]
                    : filters.skills.filter(item => item !== value);
                setFilters(prev => ({ ...prev, skills: newSkills }));
            }
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="vagas-page">
            <div className="vagas-header">
                <h1>Encontre sua vaga de estágio</h1>
                <p>Explore as oportunidades disponíveis para alunos da Fatec Zona Leste.</p>
            </div>

            <div className="vagas-container">
                {/* --- Sidebar de Filtros --- */}
                <aside className="filter-sidebar">
                    <div className="filter-group">
                        <input
                            type="text"
                            name="searchTerm"
                            placeholder="Buscar por cargo, empresa ou skill..."
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
                        <h4>Modalidade</h4>
                        <div className="checkbox-group">
                            <label><input type="checkbox" name="presencial" checked={filters.modelo.presencial} onChange={handleInputChange} /> Presencial</label>
                            <label><input type="checkbox" name="hibrido" checked={filters.modelo.hibrido} onChange={handleInputChange} /> Híbrido</label>
                            <label><input type="checkbox" name="home_office" checked={filters.modelo.home_office} onChange={handleInputChange} /> Home Office</label>
                        </div>
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

                {/* --- Lista de Vagas --- */}
                <main className="job-listings">
                    {loading && <p className="loading-message">Carregando vagas...</p>}
                    {error && <p className="no-results error-message">Erro ao carregar vagas: {error}</p>}
                    {!loading && !error && vagas.length > 0 ? (
                        vagas.map(vaga => <JobCard key={vaga.id} vaga={vaga} />)
                    ) : (
                        !loading && !error && <p className="no-results">Nenhuma vaga encontrada com os filtros selecionados.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Vagas;