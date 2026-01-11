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
      data: {
        ...data,
        userId,
      },
      select: {
        id: true,
        name: true,
        url: true,
        method: true,
        intervalSeconds: true,
        lastCheckedAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      throw new Error('Monitor already exists');
    }
    throw e;
  }
}


async function getAllMonitors(
  app: FastifyInstance,
  userId: string
) {
  return app.prisma.monitor.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      url: true,
      method: true,
      intervalSeconds: true,
      lastCheckedAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}


async function getMonitorById(
  app: FastifyInstance,
  id: string,
  userId: string
) {
  const monitor = await app.prisma.monitor.findFirst({
    where: {
      id,
      userId,
    },
    select: {
      id: true,
      name: true,
      url: true,
      method: true,
      intervalSeconds: true,
      lastCheckedAt: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!monitor) {
    throw new Error('Monitor not found');
  }

  return monitor;
}


async function updateMonitor(
  app: FastifyInstance,
  id: string,
  userId: string,
  data: {
    name?: string;
    url?: string;
    method?: string;
    intervalSeconds?: number;
    isActive?: boolean;
  }
) {
  try {
    return await app.prisma.monitor.update({
      where: {
        id_userId: { id, userId },
      },
      data,
      select: {
        id: true,
        name: true,
        url: true,
        method: true,
        intervalSeconds: true,
        lastCheckedAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      throw new Error('Monitor not found');
    }
    throw e;
  }
}


async function deleteMonitor(
  app: FastifyInstance,
  id: string
) {
  try {
    await app.prisma.monitor.delete({
      where: {
        id
      }
    });
    return { message: 'Monitor Deleted Successfully' };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new Error('Failded to delete monitordata');
    }
    throw e;
  }
}

export {
  createMonitor,
  getAllMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor
}
