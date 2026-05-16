
export const STATUS_MAP: Record<string, 'В сети' | 'Не в сети'> = {
  "В сети": 'В сети',
  "Не в сети": 'Не в сети',
};

export const STATUS_CONFIG = {
  'В сети': {
    color: 'green.500',
    label: 'В сети',
    ring: 'rgba(19, 173, 109, 0.2)',
  },
  'Не в сети': {
    color: 'gray.400',
    label: 'Не в сети',
    ring: 'rgba(128, 128, 128, 0.15)',
  },
} as const;

export const getStatusConfig = (apiStatus: string | undefined) => {
  const displayStatus = STATUS_MAP[apiStatus || ''] || 'Не в сети';
  return STATUS_CONFIG[displayStatus];
};