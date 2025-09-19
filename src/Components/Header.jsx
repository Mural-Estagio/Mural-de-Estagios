import React from 'react';
import '../Styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBars } from '@fortawesome/free-solid-svg-icons';

// O Header recebe as props para controlar o menu mobile e popular os dropdowns
const Header = ({ toggleMobileMenu, cursos}) => {
    return (
        <header className="header-container">
            <nav className="navbar">
                {/* Botão de menu "hambúrguer" para telas menores */}
                <button className="menu-toggle" onClick={toggleMobileMenu} aria-label="Abrir menu">
                    <FontAwesomeIcon icon={faBars} />
                </button>

                {/* Logo principal ou link para a Home */}
                <div className="navbar-left">
                    <a href="/" className="nav-logo">Mural de Estágios</a>
                </div>

                {/* Links de navegação para desktop */}
                <div className="navbar-links">
                    <a href="/vagas" className="nav-link">Vagas</a>
                    
                    <div className="dropdown">
                        <a href="#" className="nav-link">Cursos <span className="arrow-down">▼</span></a>
                        <div className="dropdown-content">
                            {cursos.map(curso => (
                                <a key={curso} href="#">{curso}</a>
                            ))}
                        </div>
                    </div>

                       <a href="/documentos" className="nav-link">Documentos</a>

                    <a href="/curriculo" className="nav-link">Currículo</a>
                </div>

                {/* Barra de Pesquisa */}
                <div className="search-bar">
                    <input type="text" placeholder="Pesquisar" />
                    <button type="submit" aria-label="Pesquisar">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;