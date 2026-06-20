import { API_URL } from './api';

export async function consultarBadges(usuario) {
  const response = await fetch(`${API_URL}/api/v1/notifications/badges/${usuario}`);
  if (!response.ok) {
    if (response.status === 503) {
      throw new Error('Serviço temporariamente indisponível');
    }
    throw new Error('Erro ao consultar notificações');
  }
  return response.json();
}

export async function marcarComoLidas(usuario, contato) {
  const response = await fetch(
    `${API_URL}/mensagens/${usuario}/${contato}/lidas`,
    { method: 'POST' }
  );
  if (!response.ok) {
    throw new Error('Erro ao marcar mensagens como lidas');
  }
  return response.json();
}

export function solicitarPermissaoNotificacoes() {
  if ('Notification' in window) {
    Notification.requestPermission();
  }
}

export function exibirNotificacaoPush(remetente, texto) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Nova mensagem de ${remetente}`, {
      body: texto,
      icon: '/favicon.svg',
    });
  }
}