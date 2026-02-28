export function formatDateTime(value: string | null) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString();
}

export function formatDuration(startedAt: string, resolvedAt: string | null) {
  const start = new Date(startedAt).getTime();
  const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
  const diff = Math.max(end - start, 0);

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}
