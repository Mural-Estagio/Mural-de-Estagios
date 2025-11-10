import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';

const Header = ({ toggleMobileMenu, documentos }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate('/vagas', { state: { headerSearch: searchTerm } });
            setSearchTerm(''); 
        }
    };

    return (
        <header className="header-container">
            <nav className="navbar">
                <button className="menu-toggle" onClick={toggleMobileMenu} aria-label="Abrir menu">
                    <FontAwesomeIcon icon={faBars} />
                </button>

               <div className="navbar-left">
                    <a href="/" className="nav-logo">Mural de Estágios</a>
                </div>

               <div className="navbar-links">
                    <a href="/vagas" className="nav-link">Vagas</a>
                    <div className="dropdown">
                        <span className="nav-link">
                            Documentos <span className="arrow-down">▼</span>
                        </span>
                        <div className="dropdown-content">
                            {documentos && documentos.map(doc => (
                                <a 
                                    key={doc} 
                                    href={doc === "Estágio Obrigatório" ? "/documentos-obrigatorios" : "/documentos-nao-obrigatorios"}
                                >
                                    {doc}
                                </a>
                            ))}
                        </div>
                    </div>
                  

                    <a href="/curriculo" className="nav-link">Currículo</a>
                </div>
                <form className="search-bar" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" aria-label="Pesquisar">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>
            </nav>
        </header>
    );
};

export default Header;