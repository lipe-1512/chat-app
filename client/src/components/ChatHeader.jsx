import React from 'react';

export function ChatHeader({ contatoAtivo }) {
    // Se, por algum motivo de renderização, o componente for chamado sem um contato, 
    // ele retorna null para evitar quebrar a tela (Fail-fast)
    if (!contatoAtivo) return null;

    return (
        <div style={{ 
            padding: '20px', 
            borderBottom: '1px solid #ccc', 
            backgroundColor: '#fff' 
        }}>
            <h2 style={{ margin: 0, color: '#333' }}>
                Conversando com: {contatoAtivo.nome || contatoAtivo.usuario || contatoAtivo.email}
            </h2>
        </div>
    );
}