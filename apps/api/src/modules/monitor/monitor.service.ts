import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";

async function createMonitor(
  app: FastifyInstance,
  userId: string,
  data: {
    name: string;
    url: string;
    method?: string;
    intervalSeconds?: number;
  }
) {
  try {
    return await app.prisma.monitor.create({
      data: { ...data, userId },
      select: {
        id: true, name: true, url: true, method: true,
        intervalSeconds: true, lastCheckedAt: true,
        isActive: true, createdAt: true, updatedAt: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new Error('Monitor already exists');
    }
    throw e;
  }
}

async function getAllMonitors(app: FastifyInstance, userId: string) {
  const monitors = await app.prisma.monitor.findMany({
    where: { userId },
    select: {
      id: true, name: true, url: true, method: true,
      intervalSeconds: true, lastCheckedAt: true,
      isActive: true, createdAt: true, updatedAt: true,
    },
  });

  // Augment each monitor with a derived `status` from its latest check
  return Promise.all(monitors.map(async (monitor) => {
    const latestCheck = await app.prisma.checkResult.findFirst({
      where: { monitorId: monitor.id },
      orderBy: { checkedAt: 'desc' },
      select: { status: true },
    });
    return { ...monitor, status: latestCheck?.status ?? 'PENDING' };
  }));
}

async function getMonitorById(app: FastifyInstance, id: string, userId: string) {
  const monitor = await app.prisma.monitor.findFirst({
    where: { id, userId },
    select: {
      id: true, name: true, url: true, method: true,
      intervalSeconds: true, lastCheckedAt: true,
      isActive: true, createdAt: true, updatedAt: true,
    },
  });

  if (!monitor) throw new Error('Monitor not found');

  const latestCheck = await app.prisma.checkResult.findFirst({
    where: { monitorId: id },
    orderBy: { checkedAt: 'desc' },
    select: { status: true },
  });

  return { ...monitor, status: latestCheck?.status ?? 'PENDING' };
}

async function updateMonitor(
  app: FastifyInstance, id: string, userId: string,
  data: { name?: string; url?: string; method?: string; intervalSeconds?: number; isActive?: boolean }
) {
  try {
    return await app.prisma.monitor.update({
      where: { id_userId: { id, userId } },
      data,
      select: {
        id: true, name: true, url: true, method: true,
        intervalSeconds: true, lastCheckedAt: true,
        isActive: true, createdAt: true, updatedAt: true,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw new Error('Monitor not found');
    }
    throw e;
  }
}

async function deleteMonitor(app: FastifyInstance, id: string) {
  try {
    await app.prisma.$transaction([
      app.prisma.alert.deleteMany({ where: { incident: { monitorId: id } } }),
      app.prisma.alertConfig.deleteMany({ where: { monitorId: id } }),
      app.prisma.checkResult.deleteMany({ where: { monitorId: id } }),
      app.prisma.incident.deleteMany({ where: { monitorId: id } }),
      app.prisma.monitor.delete({ where: { id } }),
    ]);
    return { message: 'Monitor Deleted Successfully' };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new Error('Failed to delete monitor data');
    }
    throw e;
  }
}

async function getMonitorChecks(app: FastifyInstance, monitorId: string, limit: number) {
  return app.prisma.checkResult.findMany({
    where: { monitorId },
    orderBy: { checkedAt: 'desc' },
    take: limit,
    select: {
      id: true, monitorId: true, region: true,
      status: true, statusCode: true, latencyms: true,
      error: true, scheduledAt: true, checkedAt: true,
    },
  });
}

async function getMonitorStats(app: FastifyInstance, monitorId: string) {
  const now = new Date();
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ago30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [c24, c7, c30, latChecks] = await Promise.all([
    app.prisma.checkResult.findMany({ where: { monitorId, checkedAt: { gte: ago24h } }, select: { status: true } }),
    app.prisma.checkResult.findMany({ where: { monitorId, checkedAt: { gte: ago7d } }, select: { status: true } }),
    app.prisma.checkResult.findMany({ where: { monitorId, checkedAt: { gte: ago30d } }, select: { status: true } }),
    app.prisma.checkResult.findMany({
      where: { monitorId, checkedAt: { gte: ago30d }, latencyms: { not: null } },
      select: { latencyms: true },
    }),
  ]);

  const uptime = (checks: { status: string }[]) => {
    if (checks.length === 0) return null;
    return (checks.filter(c => c.status === 'UP').length / checks.length) * 100;
  };

  const avgLatency = latChecks.length > 0
    ? Math.round(latChecks.reduce((s, c) => s + (c.latencyms ?? 0), 0) / latChecks.length)
    : null;

  return {
    uptime24h: uptime(c24),
    uptime7d: uptime(c7),
    uptime30d: uptime(c30),
    avgLatency,
  };
}

export {
  createMonitor, getAllMonitors, getMonitorById,
  updateMonitor, deleteMonitor,
  getMonitorChecks, getMonitorStats,
}
