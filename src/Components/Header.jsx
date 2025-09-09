import React from 'react';
import './Styles/Header.css';
import logoFatec from '../assets/fatec_logo.png';
import searchIcon from '../assets/search_icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    return (
        <header className="header-container">
            <nav className="navbar">
                <div className="navbar-links">
                    <a href="#" className="nav-link">Mural de Estágios</a>
                    <a href="#" className="nav-link">Vagas</a>
                    <div className="dropdown">
                        <a href="#" className="nav-link">Cursos <span className="arrow-down">▼</span></a>
                        {/* Dropdown content */}
                    </div>
                    <div className="dropdown">
                        <a href="#" className="nav-link">Documentos <span className="arrow-down">▼</span></a>
                        {/* Dropdown content */}
                    </div>
                    <a href="#" className="nav-link">Currículo</a>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Pesquisar" />
                    <button type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;