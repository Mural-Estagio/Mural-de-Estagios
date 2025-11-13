import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCheckCircle, faTimesCircle, faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import '../Styles/DashboardStats.css'; 

const DashboardStats = ({ vagas, loading }) => {
    if (loading) {
        return <div className="stats-container loading">Calculando estatísticas...</div>;
    }

    const totalVagas = vagas.length;
    const vagasAtivas = vagas.filter(v => v.statusVaga === 'ABERTO').length;
    const vagasInativas = totalVagas - vagasAtivas;
    const getVagasUltimos30Dias = () => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        return vagas.filter(vaga => {
            const dataPublicacao = new Date(vaga.dataPublicacao);
            return dataPublicacao >= thirtyDaysAgo && dataPublicacao <= today;
        }).length;
    };

    const vagasUltimos30Dias = getVagasUltimos30Dias();

    return (
        <section className="stats-container">
            <StatCard 
                icon={faBriefcase} 
                title="Total de Vagas" 
                value={totalVagas} 
                className="total"
            />
            <StatCard 
                icon={faCheckCircle} 
                title="Vagas Ativas" 
                value={vagasAtivas}
                className="ativas"
            />
            <StatCard 
                icon={faTimesCircle} 
                title="Vagas Inativas" 
                value={vagasInativas}
                className="inativas"
            />
            <StatCard 
                icon={faCalendarPlus} 
                title="Novas (Últ. 30 dias)" 
                value={vagasUltimos30Dias}
                className="novas"
            />
        </section>
    );
};

const StatCard = ({ icon, title, value, className }) => (
    <div className={`stat-card ${className || ''}`}>
        <FontAwesomeIcon icon={icon} className="stat-icon" />
        <div className="stat-info">
            <span className="stat-value">{value}</span>
            <span className="stat-title">{title}</span>
        </div>
    </div>
);

export default DashboardStats;