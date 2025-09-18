import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';

import logoFatec from '../Assets/fatec_logo_white.png';
import logoCPS from '../Assets/cps_logo_white.png';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                {/* Seção Superior: Links e Logos */}
                <div className="footer-top">
                    <div className="fatec-info">
                        <a href="https://fateczl.cps.sp.gov.br/" target="_blank" rel="noopener noreferrer" className="fatec-link">
                            https://fateczl.cps.sp.gov.br/
                        </a>
                        <div className="social-icons">
                            <a href="#" aria-label="Twitter"><FontAwesomeIcon icon={faXTwitter} /></a>
                            <a href="#" aria-label="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#" aria-label="Youtube"><FontAwesomeIcon icon={faYoutube} /></a>
                            <a href="#" aria-label="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></a>
                        </div>
                    </div>
                    <div className="fatec-logos">
                        <img src={logoFatec} alt="Logo da Fatec Zona Leste" className="logo fatec-logo" />
                        <img src={logoCPS} alt="Logo do Centro Paula Souza" className="logo cps-logo" />
                    </div>
                </div>

                {/* Seção de Detalhes: Endereço, Telefone, Horário */}
                <div className="footer-details">
                    <div className="detail-item">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon" />
                        <span>
                            Fatec Zona Leste<br />
                            Av. Águia de Haia, 2.983 - Cidade A. E.<br />
                            Carvalho - São Paulo/SP - CEP: 03694-000
                        </span>
                    </div>
                    <div className="detail-item">
                        <FontAwesomeIcon icon={faPhone} className="detail-icon" />
                        <span>
                            Telefone:<br />
                            (11) 2040-4100
                        </span>
                    </div>
                    <div className="detail-item">
                        <FontAwesomeIcon icon={faClock} className="detail-icon" />
                        <span>
                            Horário de funcionamento:<br />
                            Seg. a Sex. das 07:30 às 23:00
                        </span>
                    </div>
                </div>
            </div>

            {/* Seção Inferior: Copyright e Login Admin */}
            <div className="footer-bottom">
                <p>© 2002-2025 - Centro Paula Souza - Desenvolvido por FatecZL - Todos os direitos reservados.</p>
                {/* BOTÃO ADICIONADO AQUI */}
                <Link to="/admin/Login" className="admin-login-link">
                    Login Administrador
                </Link>
            </div>
        </footer>
    );
};

export default Footer;