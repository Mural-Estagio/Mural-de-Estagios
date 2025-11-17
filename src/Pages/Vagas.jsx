import React, { useState, useEffect, useMemo } from 'react'; 
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
        e.preventDefault(); 
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

    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0);
    const VAGAS_PER_PAGE = 30; 
    
    const [dynamicSkillsList, setDynamicSkillsList] = useState([]);
    const [skillSearchTerm, setSkillSearchTerm] = useState('');

    const [filters, setFilters] = useState({
        searchTerm: headerSearchTerm || '', 
        shift: { manha: false, tarde: false, noite: false },
        modelo: { presencial: false, hibrido: false, home_office: false },
        courses: cursoSelecionado ? [cursoSelecionado] : [],
        skills: [] 
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [cursosRes, habilidadesRes] = await Promise.all([
                    api.get('/cursos'),
                    api.get('/habilidades')
                ]);

                const cursos = cursosRes.data;
                const map = {};
                const filtro = [];
                cursos.forEach(curso => {
                    map[curso.nomeCompleto] = curso.sigla; 
                    filtro.push(curso.nomeCompleto);
                });
                setCursoMap(map);
                setCursosFiltro(filtro);

                const sortedSkills = habilidadesRes.data.sort((a, b) => a.nome.localeCompare(b.nome));
                setDynamicSkillsList(sortedSkills);

            } catch (err) {
                console.error("Erro ao buscar dados iniciais:", err);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (cursosFiltro.length === 0 && cursoSelecionado && Object.keys(cursoMap).length === 0) {
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
                    .filter(k => filters.shift[k]),
                page: currentPage,
                size: VAGAS_PER_PAGE
            };
           
            if (params.cursos.length === 0) delete params.cursos;
            if (params.modelos.length === 0) delete params.modelos;
            if (params.periodos.length === 0) delete params.periodos;

            try {
                const response = await api.get('/vagas', { params });
                if (!response.data) throw new Error('Nenhuma vaga encontrada');

                let vagasFiltradas = response.data.content;
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
                setTotalPages(response.data.totalPages);

            } catch (error) {
                console.error("Erro ao buscar vagas filtradas:", error);
                setError(error.response?.data?.message || error.message || 'Erro ao carregar vagas');
                setVagas([]); 
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchVagasFiltradas();
        
    }, [filters, cursoMap, cursosFiltro.length, cursoSelecionado, currentPage]); 

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setCurrentPage(0);

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

    const filteredSkillsForDisplay = useMemo(() => {
        return dynamicSkillsList.filter(skill =>
            skill.nome.toLowerCase().includes(skillSearchTerm.toLowerCase())
        );
    }, [dynamicSkillsList, skillSearchTerm]);
    const PaginationControls = () => {

        if (totalPages <= 1) return null; 
        const pages = [];
        for (let i = 0; i < totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`page-btn ${i === currentPage ? 'active' : ''}`}
                    aria-current={i === currentPage}
                    aria-label={`Ir para página ${i + 1}`}
                >
                    {i + 1}
                </button>
            );
        }
        return (
            <div className="pagination-container">
                <button 
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="page-btn"
                >
                    &lt; Anterior
                </button>
                {pages}
                <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="page-btn"
                >
                    Próxima &gt;
                </button>
            </div>
        );
    };
    return (
        <div className="vagas-page">
            <div className="vagas-header">
                <h1>Encontre sua vaga de estágio</h1>
                <p>Explore as oportunidades disponíveis para alunos da Fatec Zona Leste.</p>
            </div>

            <div className="vagas-container">
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
                        <input
                            type="text"
                            placeholder="Buscar habilidade..."
                            className="search-input"
                            value={skillSearchTerm}
                            onChange={(e) => setSkillSearchTerm(e.target.value)}
                            style={{ marginBottom: '15px' }}
                        />
                        <div className="checkbox-group scrollable">
                            {filteredSkillsForDisplay.map(skill => (
                                <label key={skill.id}>
                                    <input
                                        type="checkbox"
                                        name="skill"
                                        value={skill.nome} 
                                        checked={filters.skills.includes(skill.nome)}
                                        onChange={handleInputChange}
                                    /> {skill.nome}
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

                    {!loading && !error && (
                        <PaginationControls />
                    )}
                </main>
            </div>
        </div>
    );
};

export default Vagas;