import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBuilding, faLaptopCode, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import '../Styles/DashboardStats.css'; 

const DashboardStats = ({ vagas, loading }) => {
    if (loading) {
        return <div className="stats-container loading">Calculando estatísticas...</div>;
    }

    const totalVagas = vagas.length;
    
    const modalidades = {
        PRESENCIAL: 0,
        HIBRIDO: 0,
        HOME_OFFICE: 0
    };

    const vagasAtivas = vagas.filter(v => v.statusVaga === 'ABERTO').length;


    vagas.forEach(vaga => {
        if (vaga.modelo && modalidades.hasOwnProperty(vaga.modelo)) {
            modalidades[vaga.modelo]++;
        }
    });

    return (
        <section className="stats-container">
            <StatCard icon={faBriefcase} title="Vagas Ativas" value={vagasAtivas} />
            <StatCard icon={faMapMarkerAlt} title="Presencial" value={modalidades.PRESENCIAL} />
            <StatCard icon={faBuilding} title="Híbrido" value={modalidades.HIBRIDO} />
            <StatCard icon={faLaptopCode} title="Home Office" value={modalidades.HOME_OFFICE} />
        </section>
    );
};

const StatCard = ({ icon, title, value }) => (
    <div className="stat-card">
        <FontAwesomeIcon icon={icon} className="stat-icon" />
        <div className="stat-info">
            <span className="stat-value">{value}</span>
            <span className="stat-title">{title}</span>
        </div>
    </div>
);

export default DashboardStats;