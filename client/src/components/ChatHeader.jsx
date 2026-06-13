import React from 'react';

export function ChatHeader({ contatoAtivo, isMobile, onVoltar }) {
    // Se, por algum motivo de renderização, o componente for chamado sem um contato, 
    // ele retorna null para evitar quebrar a tela (Fail-fast)
    if (!contatoAtivo) return null;

    return (
        <div style={{ 
            padding: '20px', 
            borderBottom: '1px solid #ccc', 
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center'
        }}> 
            {/* Renderiza o botão "Voltar" apenas em dispositivos móveis */}
            {isMobile && (
                <button 
                    onClick={onVoltar}
                    style={{
                        marginRight: '15px',
                        padding: '8px 12px',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#e2e2e2',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ⬅ Voltar
                </button>
            )}

            <h2 style={{ margin: 0, color: '#333' }}>
                {contatoAtivo.nome || contatoAtivo.usuario || contatoAtivo.email}
            </h2>
        </div>
    );
}