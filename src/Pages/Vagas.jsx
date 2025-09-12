import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Vagas.css';

// --- Dados Fictícios (Mock Data) ---
// No futuro, estes dados virão de um backend/API.
const mockVagas = [
    { id: 1, title: 'Analista de Sistema Pleno', company: 'Microsoft', logo: 'https://img.icons8.com/color/48/microsoft.png', date: '05/09/2025', shift: 'Tarde', salary: 2500, course: 'Análise e Desenvolvimento de Sistemas', skills: ['SQL', 'Java', 'Gestão de Projetos'] },
    { id: 2, title: 'Estágio TI: Desenvolvedor Back-End', company: 'Microsoft', logo: 'https://img.icons8.com/color/48/microsoft.png', date: '04/09/2025', shift: 'Manhã', salary: 1800, course: 'Desenvolvimento de Software Multiplataforma', skills: ['Node.js', 'API', 'Banco de Dados'] },
    { id: 3, title: 'Analista de Sistema Jr', company: 'Google', logo: 'https://img.icons8.com/color/48/google-logo.png', date: '05/09/2025', shift: 'Manhã', salary: 1900, course: 'Análise e Desenvolvimento de Sistemas', skills: ['Python', 'Cloud', 'SQL'] },
    { id: 4, title: 'Desenvolvedor Front-End Jr', company: 'Facebook', logo: 'https://img.icons8.com/color/48/facebook-new.png', date: '02/09/2025', shift: 'Tarde', salary: 2200, course: 'Desenvolvimento de Software Multiplataforma', skills: ['React', 'CSS', 'JavaScript'] },
    { id: 5, title: 'Assistente de Logística', company: 'Amazon', logo: 'https://img.icons8.com/color/48/amazon.png', date: '01/09/2025', shift: 'Noite', salary: 1200, course: 'Logística', skills: ['Excel', 'SAP', 'Organização'] },
    { id: 6, title: 'Estágio em RH', company: 'Natura', logo: 'https://img.icons8.com/color/48/rebrandly.png', date: '30/08/2025', shift: 'Manhã', salary: 1500, course: 'Gestão de Recursos Humanos', skills: ['Word', 'Comunicação'] },
];

const cursosFiltro = [ "Análise e Desenvolvimento de Sistemas", "Desenvolvimento de Software Multiplataforma", "Comércio Exterior", "Gestão de Recursos Humanos", "Gestão Empresarial", "Polímeros", "Logística", "Desenvolvimento de Produtos Plásticos" ];
const habilidadesFiltro = [  'Excel', 'Word', 'PowerPoint', 'Comunicação', 'Organização', 'Inglês Básico', 'Inglês Intermediário', 'Inglês Avançado', 'Espanhol', 'Programação', 'Java', 'Python', 'SQL', 'React', 'JavaScript', 'HTML', 'CSS', 'Node.js', 'API', 'Banco de Dados', 'Git', 'Cloud', 'SAP', 'Gestão de Projetos', 'Metodologias Ágeis', 'Química', 'Processos Industriais', 'Negociação'  ];

const JobCard = ({ vaga }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const link = `${window.location.origin}/vagas#${vaga.id}`;
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
                <img src={vaga.logo} alt={`Logo da ${vaga.company}`} className="company-logo" />
                <div className="card-title">
                    <h3>{vaga.title}</h3>
                    <p>{vaga.company}</p>
                </div>
                <div className="options-container">
                    <button className="options-btn" aria-label="Mais opções" onClick={handleShare}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {copied && <span className="copy-feedback">Link Copiado!</span>}
                </div>
            </div>
            <div className="card-body">
                <p>{vaga.description}</p>
            </div>
            <div className="card-footer">
                <a href="/vagas/:vagaId" className="confirm-button">Confira</a>
                <span>{vaga.date}</span>
            </div>
        </div>
    );
};

const Vagas = () => {
    const [filters, setFilters] = useState({
        searchTerm: '',
        shift: { manha: false, tarde: false, noite: false },
        salary: 9999, 
        courses: [],
        skills: []
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            if (['manha', 'tarde', 'noite'].includes(name)) {
                setFilters(prev => ({ ...prev, shift: { ...prev.shift, [name]: checked } }));
            } else {
                const filterGroup = name === 'course' ? 'courses' : 'skills';
                const currentValues = filters[filterGroup];
                if (checked) {
                    setFilters(prev => ({ ...prev, [filterGroup]: [...currentValues, value] }));
                } else {
                    setFilters(prev => ({ ...prev, [filterGroup]: currentValues.filter(item => item !== value) }));
                }
            }
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const filteredVagas = mockVagas.filter(vaga => {
        const { searchTerm, shift, salary, courses, skills } = filters;

        const searchTermMatch = !searchTerm || vaga.title.toLowerCase().includes(searchTerm.toLowerCase()) || vaga.company.toLowerCase().includes(searchTerm.toLowerCase());
        const shiftMatch = (!shift.manha && !shift.tarde && !shift.noite) || (shift.manha && vaga.shift === 'Manhã') || (shift.tarde && vaga.shift === 'Tarde') || (shift.noite && vaga.shift === 'Noite');
        const salaryMatch = vaga.salary <= salary;
        const courseMatch = courses.length === 0 || courses.includes(vaga.course);
        const skillsMatch = skills.length === 0 || skills.every(skill => vaga.skills.includes(skill));

        return searchTermMatch && shiftMatch && salaryMatch && courseMatch && skillsMatch;
    });

    return (
        <div className="vagas-page">
            <div className="vagas-header">
                <h1>Vagas de Estágio</h1>
            </div>

            <div className="vagas-container">
                {/* --- Painel de Filtros Lateral --- */}
                <aside className="filter-sidebar">
                    <div className="filter-group">
                        <input type="text" name="searchTerm" placeholder="Busque por cargo ou empresa..." className="search-input" value={filters.searchTerm} onChange={handleInputChange} />
                    </div>
                    
                    <div className="filter-group">
                        <h4>Turno</h4>
                        <div className="checkbox-group">
                            <label><input type="checkbox" name="manha" checked={filters.shift.manha} onChange={handleInputChange}/> Manhã</label>
                            <label><input type="checkbox" name="tarde" checked={filters.shift.tarde} onChange={handleInputChange}/> Tarde</label>
                            <label><input type="checkbox" name="noite" checked={filters.shift.noite} onChange={handleInputChange}/> Noite</label>
                        </div>
                    </div>
                    
                    <div className="filter-group">
                        <h4>Faixa Salarial</h4>
                        <div className="salary-slider">
                            <span>R$ 500</span>
                            <span>Até R$ {filters.salary}</span>
                        </div>
                        <input type="range" name="salary" min="500" max="9999" step="100" className="slider" value={filters.salary} onChange={handleInputChange} />
                    </div>

                    <div className="filter-group">
                        <h4>Cursos</h4>
                        <div className="checkbox-group scrollable">
                            {cursosFiltro.map(curso => (
                                <label key={curso}><input type="checkbox" name="course" value={curso} onChange={handleInputChange}/> {curso}</label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="filter-group">
                        <h4>Habilidades</h4>
                        <div className="checkbox-group scrollable">
                            {habilidadesFiltro.map(skill => (
                                <label key={skill}><input type="checkbox" name="skill" value={skill} onChange={handleInputChange}/> {skill}</label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* --- Lista de Vagas --- */}
                <main className="job-listings">
                    {filteredVagas.length > 0 ? (
                        filteredVagas.map(vaga => <JobCard key={vaga.id} vaga={vaga} />)
                    ) : (
                        <p className="no-results">Nenhuma vaga encontrada com os filtros selecionados.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Vagas;