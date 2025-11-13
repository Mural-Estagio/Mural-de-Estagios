import React, { useMemo } from 'react';
import '../Styles/DashboardGraphs.css';
const BarChart = ({ title, data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="graph-widget">
                <h3>{title}</h3>
                <p>Sem dados para exibir.</p>
            </div>
        );
    }
    const maxValor = Math.max(...data.map(item => item.value));

    return (
        <div className="graph-widget">
            <h3>{title}</h3>
            <div className="bar-chart-container">
                {data
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => {
                        const percent = (item.value / maxValor) * 100;
                        return (
                            <div key={index} className="bar-item" title={`${item.label}: ${item.value}`}>
                                <span className="bar-label">{item.label}</span>
                                <div className="bar-wrapper">
                                    <div 
                                        className="bar-fill" 
                                        style={{ width: `${percent}%` }}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
const DashboardGraphs = ({ vagas, cursos, loading }) => {
    const vagasPorCurso = useMemo(() => {
        if (loading || cursos.length === 0 || vagas.length === 0) return [];
        const cursoMap = cursos.reduce((acc, curso) => {
            acc[curso.sigla] = curso.nomeCompleto;
            return acc;
        }, {});

        const contagem = {};
        
        vagas.forEach(vaga => {
            if (vaga.cursosAlvo) {
                vaga.cursosAlvo.forEach(sigla => {
                    contagem[sigla] = (contagem[sigla] || 0) + 1;
                });
            }
        });

        return Object.entries(contagem).map(([sigla, valor]) => ({
            label: cursoMap[sigla] || sigla, 
            value: valor
        }));
    }, [vagas, cursos, loading]);
    const vagasPorModalidade = useMemo(() => {
        if (loading || vagas.length === 0) return [];

        const contagem = {
            PRESENCIAL: 0,
            HIBRIDO: 0,
            HOME_OFFICE: 0
        };
        
        vagas.forEach(vaga => {
            if (vaga.modelo && contagem.hasOwnProperty(vaga.modelo)) {
                contagem[vaga.modelo]++;
            }
        });
        return [
            { label: 'Presencial', value: contagem.PRESENCIAL },
            { label: 'Híbrido', value: contagem.HIBRIDO },
            { label: 'Home Office', value: contagem.HOME_OFFICE }
        ];

    }, [vagas, loading]);


    if (loading) {
        return null; 
    }

    return (
        <section className="dashboard-graphs-container">
            <BarChart title="Vagas por Curso" data={vagasPorCurso} />
            <BarChart title="Vagas por Modalidade" data={vagasPorModalidade} />
        </section>
    );
};

export default DashboardGraphs;