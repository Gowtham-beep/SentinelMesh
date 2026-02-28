import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MonitorStatus } from '@/types';

export function StatusBadge({ status }: { status: MonitorStatus }) {
  return (
    <Badge
      className={cn(
        'border-transparent font-medium',
        status === 'UP' && 'bg-green-100 text-green-700',
        status === 'DOWN' && 'bg-red-100 text-red-700',
        status === 'PENDING' && 'bg-zinc-200 text-zinc-700',
      )}
    >
      {status}
    </Badge>
  );
}
