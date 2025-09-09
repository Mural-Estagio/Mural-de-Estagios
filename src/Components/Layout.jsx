import React from 'react';
import Header from './Header';
import Footer from './Footer';

/**
 * Componente Layout
 * Responsável por renderizar a estrutura principal da página,
 * incluindo o Header e o Footer, e exibir o conteúdo da página atual (children).
 */
const Layout = ({ children, toggleMobileMenu, cursos, documentos }) => {
    return (
        <div className="app-container">
            <Header toggleMobileMenu={toggleMobileMenu} cursos={cursos} documentos={documentos} />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;