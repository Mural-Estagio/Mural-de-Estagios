import React from 'react';
import './Styles/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faInstagram, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faMapMarkerAlt, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';

import logoFatec from '../assets/fatec_logo_white.png'; // Make sure you have a white logo version
import logoCPS from '../assets/cps_logo_white.png'; // Make sure you have a white logo version

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="fatec-info">
                        <a href="https://lfateczl.cps.sp.gov.br/" className="fatec-link">https://lfateczl.cps.sp.gov.br/</a>
                        <div className="social-icons">
                            <a href="#"><FontAwesomeIcon icon={faXTwitter} /></a>
                            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
                            <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
                        </div>
                    </div>
                    <div className="fatec-logos">
                        <img src={logoFatec} alt="Fatec Zona Leste" className="logo fatec-logo" />
                        <img src={logoCPS} alt="Centro Paula Souza" className="logo cps-logo" />
                    </div>
                </div>
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
            <div className="footer-bottom">
                <p>© 2002/2025 - Centro Paula Souza - Desenvolvido por FatecZL - Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;