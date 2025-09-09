import React from 'react';
import '../Styles/MobileMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente MobileMenu
 * Menu lateral que aparece em telas menores, contendo os links de navegação.
 * Controlado pelo estado `isOpen` no componente App.
 */
const MobileMenu = ({ isOpen, toggleMenu, cursos, documentos }) => {
    return (
        <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`}>
            <button className="close-btn" onClick={toggleMenu} aria-label="Fechar menu">
                <FontAwesomeIcon icon={faTimes} />
            </button>

            <div className="mobile-links">
                <a href="/" className="nav-link" onClick={toggleMenu}>Mural de Estágios</a>
                <a href="/vagas" className="nav-link" onClick={toggleMenu}>Vagas</a>
                
                {/* Dropdown de Cursos para Mobile */}
                <div className="mobile-dropdown">
                    <span className="nav-link mobile-dropdown-toggle">Cursos <span className="arrow-down">▼</span></span>
                    <div className="mobile-dropdown-content">
                        {cursos.map(curso => (
                            <a key={curso} href="#" onClick={toggleMenu}>{curso}</a>
                        ))}
                    </div>
                </div>

                {/* Dropdown de Documentos para Mobile */}
                <div className="mobile-dropdown">
                    <span className="nav-link mobile-dropdown-toggle">Documentos <span className="arrow-down">▼</span></span>
                    <div className="mobile-dropdown-content">
                        {documentos.map(doc => (
                            <a key={doc} href="#" onClick={toggleMenu}>{doc}</a>
                        ))}
                    </div>
                </div>

                <a href="/curriculo" className="nav-link" onClick={toggleMenu}>Currículo</a>
            </div>
        </div>
    );
};

export default MobileMenu;