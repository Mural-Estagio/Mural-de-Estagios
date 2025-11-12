import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { api } from '../Service/api';
import '../Styles/ListaVagasAdmin.css'; 

const ListaVagasAdmin = ({ vagas, onSuccessRefresh, onEdit }) => {

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja APAGAR permanentemente esta vaga? Esta ação não pode ser desfeita.')) {
            try {
                await api.delete(`/vagas/${id}`);
                onSuccessRefresh(); // Chama a função de refresh (fetchVagas) do pai
            } catch (err) {
                alert('Erro ao apagar vaga.');
                console.error(err);
            }
        }
    };
    
    const handleCloseVaga = async (id) => {
         if (window.confirm('Tem certeza que deseja FECHAR esta vaga? (Ela deixará de ser pública)')) {
            try {
                await api.patch(`/vagas/${id}`);
                onSuccessRefresh(); // Reutiliza a função de refresh
            } catch (err) {
                alert('Erro ao fechar vaga.');
                console.error(err);
            }
        }
    };


    return (
        <div className="lista-vagas-admin">
            <h2>Gerenciar Vagas Publicadas</h2>
            {vagas.length === 0 ? (
                <p>Nenhuma vaga cadastrada no momento.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Empresa</th>
                            <th>Status</th>
                            <th>Data Pub.</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vagas.map(vaga => (
                            <tr key={vaga.id}>
                                <td data-label="Título">{vaga.titulo}</td>
                                <td data-label="Empresa">{vaga.empresa}</td>
                                <td data-label="Status">
                                    <span className={`status ${vaga.statusVaga?.toLowerCase()}`}>
                                        {vaga.statusVaga}
                                    </span>
                                </td>
                                <td data-label="Data Pub.">{vaga.dataPublicacao ? new Date(vaga.dataPublicacao).toLocaleDateString('pt-BR') : 'N/D'}</td>
                                <td className="actions-cell">
                                    <button 
                                        className="btn-action edit" 
                                        title="Editar Vaga"
                                        onClick={() => onEdit(vaga)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button 
                                        className="btn-action close" 
                                        title="Fechar Vaga (Inativar)"
                                        onClick={() => handleCloseVaga(vaga.id)}
                                        disabled={vaga.statusVaga === 'FECHADO'}
                                    >
                                        <FontAwesomeIcon icon={faTimesCircle} />
                                    </button>
                                    <button 
                                        className="btn-action delete" 
                                        title="Apagar Vaga"
                                        onClick={() => handleDelete(vaga.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListaVagasAdmin;