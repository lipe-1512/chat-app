import { useState, useEffect, useRef } from "react";
import { API_URL, WS_URL } from "../services/api";

export function useChatMotor(usuarioLogado, contatoAtivo) {
    const [historico, setHistorico] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const ws = useRef(null);

    // Efeito para conectar no WebSocket (O Motor do Chat)
    useEffect(() => {
        if (!usuarioLogado) return;

        ws.current = new WebSocket(`${WS_URL}/ws/${usuarioLogado}`);
        ws.current.onopen = () => console.log("WebSocket Conectado como:", usuarioLogado);

        ws.current.onmessage = (event) => {
            try {
                // O backend agora manda um JSON perfeito com o ID real!
                const pacote = JSON.parse(event.data);

                if (pacote.texto) {
                    setHistorico((prev) => [...prev, {
                        id_mensagem: pacote.id_mensagem,
                        texto: pacote.texto,
                        remetente: pacote.remetente
                    }]);
                }
            } catch (e) {
                console.error("Erro ao ler mensagem do websocket:", e);
            }
        };

        return () => ws.current?.close();
    }, [usuarioLogado]);

    // Efeito para carregar o histórico de mensagens quando muda de contato
    useEffect(() => {
        const carregarHistorico = async () => {
            if (!contatoAtivo) return;

            try {
                setHistorico([]);

                const destinatario = contatoAtivo.usuario || contatoAtivo.email;
                if (!destinatario) return;

                const resposta = await fetch(`${API_URL}/mensagens/${usuarioLogado}/${destinatario}`);

                if (resposta.ok) {
                    const mensagensAntigas = await resposta.json();

                    const historicoFormatado = mensagensAntigas.map(msg => ({
                        id_mensagem: msg.id_mensagem,
                        texto: msg.texto,
                        remetente: msg.remetente,
                        editada: msg.editada || false
                    }));

                    setHistorico(historicoFormatado);
                }
            } catch (erro) {
                console.error("Erro ao carregar o histórico:", erro);
            }
        };

        carregarHistorico();
    }, [contatoAtivo, usuarioLogado]);

    // Efeito para monitorar a internet e despachar mensagens presas
    useEffect(() => {
        const handleOffline = () => setIsOnline(false);
        const handleOnline = () => {
            setIsOnline(true);

            // Assim que a internet volta, despacha tudo o que estava preso
            setHistorico((prevHistorico) => {
                const pendentes = prevHistorico.filter(m => m.status === 'Aguardando conexão');

                pendentes.forEach(msg => {
                    const pacote = {
                        para: contatoAtivo?.usuario || contatoAtivo?.email,
                        texto: msg.texto
                    };
                    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                        ws.current.send(JSON.stringify(pacote));
                    }
                });

                // Atualiza o visual para "Enviada"
                return prevHistorico.map(m =>
                    m.status === 'Aguardando conexão' ? { ...m, status: 'Enviada' } : m
                );
            });
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, [contatoAtivo]);

    // Função para Enviar a Mensagem
    const enviarMensagem = (textoMensagem) => {

        // Usa o parâmetro em vez da variável antiga 'mensagem'
        if (!textoMensagem.trim() || !contatoAtivo) return;

        // Lógica Offline
        if (!isOnline) {
            setHistorico((prev) => [...prev, {
                id_mensagem: `offline-${Date.now()}`,
                texto: textoMensagem,
                remetente: usuarioLogado,
                status: 'Aguardando conexão'
            }]);

            return;
        }

        // Lógica Online
        const pacote = {
            para: contatoAtivo.usuario || contatoAtivo.email,
            texto: textoMensagem
        };
        ws.current.send(JSON.stringify(pacote));
    };

    const editarMensagem = async (msg) => {
        const novoTexto = prompt("Novo texto da mensagem:", msg.texto);
        if (!novoTexto) return;

        const resposta = await fetch(`${API_URL}/mensagens/${msg.id_mensagem}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: usuarioLogado,
                novo_texto: novoTexto
            })
        });

        if (resposta.ok) {
            setHistorico((prev) =>
                prev.map((m) =>
                    m.id_mensagem === msg.id_mensagem
                        ? { ...m, texto: novoTexto, editada: true }
                        : m
                )
            );
        }
    };

    const excluirMensagem = async (msg) => {
        const resposta = await fetch(`${API_URL}/mensagens/${msg.id_mensagem}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: usuarioLogado
            })
        });

        if (resposta.ok) {
            setHistorico((prev) =>
                prev.filter((m) => m.id_mensagem !== msg.id_mensagem)
            );
        }
    };

    // Retorna apenas o que a tela precisa para desenhar a UI e disparar os cliques
    return {
        historico,
        isOnline,
        enviarMensagem,
        editarMensagem,
        excluirMensagem
    };
}