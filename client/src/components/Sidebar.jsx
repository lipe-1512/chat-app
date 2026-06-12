import React from 'react';

export function Sidebar({ 
    usuarioLogado, 
    contatos, 
    contatoAtivo, 
    onSelectContato, 
    onOpenPerfil 
}) {
    return (
        <div style={{ width: '300px', borderRight: '1px solid #ccc', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column' }}>
            
            {/* CABEÇALHO DA SIDEBAR: Info do Usuário e Botão de Configurações */}
            <div style={{ padding: '20px', borderBottom: '1px solid #ddd', backgroundColor: '#e2e2e2' }}>
                <strong>Logado como:</strong> <br />
                <span>{usuarioLogado}</span>

                <button
                    data-cy="btn-configuracoes"
                    onClick={onOpenPerfil} // ⬅️ Avisa o Chat.jsx que o botão foi clicado
                    style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: '#0E49B5',
                        color: '#fff',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    ⚙️ Configurações
                </button>
            </div>

            {/* LISTA DE CONTATOS */}
            <h3 style={{ padding: '10px 20px', margin: 0 }}>Contatos</h3>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, overflowY: 'auto', flex: 1 }}>
                {contatos.map((contato, index) => (
                    <li
                        key={index}
                        data-cy={`contato-${contato.usuario || contato.email}`}
                        onClick={() => onSelectContato(contato)} // ⬅️ Avisa o Chat.jsx qual contato foi escolhido
                        style={{
                            padding: '15px 20px',
                            cursor: 'pointer',
                            // Destaca o fundo caso este seja o contato ativo no momento
                            backgroundColor: contatoAtivo?.usuario === contato.usuario ? '#d1ecf1' : 'transparent',
                            borderBottom: '1px solid #eee',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <strong>{contato.nome || contato.usuario || contato.email}</strong> <br />
                        <small style={{ color: '#666' }}>@{contato.usuario || contato.email}</small>
                    </li>
                ))}
            </ul>
            
        </div>
    );
}