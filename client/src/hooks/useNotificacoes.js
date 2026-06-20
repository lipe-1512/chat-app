import { useEffect, useState, useCallback } from 'react';
import { API_URL } from '../services/api';

export function useNotificacoes(usuarioLogado, contatoAtivo) {
  const [badges, setBadges] = useState({});
  const [bannerAtivo, setBannerAtivo] = useState(null);
  const [erroConexao, setErroConexao] = useState(false);

  // Consultar badges periodicamente
  useEffect(() => {
    if (!usuarioLogado) return;

    const consultarBadges = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token
          ? { 'Authorization': `Bearer ${token}` }
          : {};

        const resposta = await fetch(`${API_URL}/api/v1/notifications/badges`, {
          method: 'GET',
          headers
        });

        if (!resposta.ok) {
          if (resposta.status === 503) {
            setErroConexao(true);
            return;
          }
          // Se não autenticado (401), apenas ignora
          if (resposta.status === 401) return;
          throw new Error('Erro ao consultar badges');
        }

        const dados = await resposta.json();
        setBadges(dados);
        setErroConexao(false);
      } catch (erro) {
        setErroConexao(true);
        console.error('Erro ao consultar badges:', erro);
      }
    };

    consultarBadges();
    const intervalo = setInterval(consultarBadges, 30000); // A cada 30s
    return () => clearInterval(intervalo);
  }, [usuarioLogado]);

  // Exibir banner quando mensagem chega
  const exibirBanner = useCallback((remetente, texto) => {
    setBannerAtivo({ remetente, texto });
    setTimeout(() => setBannerAtivo(null), 4000);
  }, []);

  // Zerar badge ao abrir conversa
  const zerarBadge = useCallback(async (contato) => {
    try {
      const resposta = await fetch(
        `${API_URL}/mensagens/${usuarioLogado}/${contato}/lidas`,
        { method: 'POST' }
      );
      if (!resposta.ok) return;

      setBadges(prev => {
        const novos = { ...prev };
        delete novos[contato];
        return novos;
      });
    } catch (erro) {
      console.error('Erro ao zerar badge:', erro);
    }
  }, [usuarioLogado]);

  // Notificação push nativa do navegador
  const notificarPush = useCallback((remetente, texto) => {
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`Nova mensagem de ${remetente}`, {
        body: texto,
        icon: '/favicon.svg'
      });
    }
  }, []);

  return {
    badges,
    bannerAtivo,
    erroConexao,
    exibirBanner,
    zerarBadge,
    notificarPush
  };
}