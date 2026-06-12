import React, { useEffect, useRef } from 'react';
import MensagemItem from './MensagemItem'; // Assumindo que este já existe na pasta components

export function AreaMensagens({ historico, usuarioLogado, onEditar, onExcluir }) {
    const fimDoChatRef = useRef(null);

    // Efeito isolado: Rola o chat para o fim sempre que chegar uma mensagem nova
    useEffect(() => {
        fimDoChatRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [historico]);

    return (
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#ece5dd' }}>
            {historico.map((msg, index) => (
                <MensagemItem
                    key={msg.id_mensagem || index}
                    msg={msg}
                    usuarioLogado={usuarioLogado}
                    onEditar={() => onEditar(msg)}
                    onExcluir={() => onExcluir(msg)}
                />
            ))}
            {/* Esta div invisível é a âncora para onde o scroll é puxado */}
            <div ref={fimDoChatRef} />
        </div>
    );
}