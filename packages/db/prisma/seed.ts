import "@but/config";
import {
  AlertStatus,
  AlertType,
  IncidentScope,
  IncidentStatus,
} from "@prisma/client";
import prisma from "../src/index.ts";

const TEST_USER_EMAIL = "tester@sentinelmesh.dev";
const TEST_USER_PASSWORD_HASH =
  "$2b$10$cX/D3pPEdLuczM.Gx49Bv.ir/aK6VaPd3fSmu3/EA1fpRAbfEzCAW"; // Test@12345

async function seed() {
  const user = await prisma.user.upsert({
    where: { email: TEST_USER_EMAIL },
    update: { name: "Test User", password: TEST_USER_PASSWORD_HASH },
    create: {
      email: TEST_USER_EMAIL,
      name: "Test User",
      password: TEST_USER_PASSWORD_HASH,
    },
    select: { id: true, email: true },
  });

  const monitorNames = ["Sentinel API", "Docs Site"];
  const existingMonitors = await prisma.monitor.findMany({
    where: { userId: user.id, name: { in: monitorNames } },
    select: { id: true },
  });

  const existingMonitorIds = existingMonitors.map((monitor) => monitor.id);
  if (existingMonitorIds.length > 0) {
    const incidents = await prisma.incident.findMany({
      where: { monitorId: { in: existingMonitorIds } },
      select: { id: true },
    });
    const incidentIds = incidents.map((incident) => incident.id);

    if (incidentIds.length > 0) {
      await prisma.alert.deleteMany({
        where: { incidentId: { in: incidentIds } },
      });
    }

    await prisma.incident.deleteMany({
      where: { monitorId: { in: existingMonitorIds } },
    });
    await prisma.checkResult.deleteMany({
      where: { monitorId: { in: existingMonitorIds } },
    });
    await prisma.alertConfig.deleteMany({
      where: { monitorId: { in: existingMonitorIds } },
    });
    await prisma.monitor.deleteMany({
      where: { id: { in: existingMonitorIds } },
    });
  }

  const apiMonitor = await prisma.monitor.create({
    data: {
      userId: user.id,
      name: "Sentinel API",
      url: "https://api.sentinelmesh.dev/health",
      method: "GET",
      intervalSeconds: 60,
      isActive: true,
      alerts: {
        create: {
          email: user.email,
        },
      },
    },
    select: { id: true, name: true },
  });

  const docsMonitor = await prisma.monitor.create({
    data: {
      userId: user.id,
      name: "Docs Site",
      url: "https://sentinelmesh.dev/docs",
      method: "GET",
      intervalSeconds: 120,
      isActive: true,
      alerts: {
        create: {
          email: user.email,
          webhookUrl: "https://example.com/webhook/sentinelmesh",
        },
      },
    },
    select: { id: true, name: true },
  });

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const fourMinutesAgo = new Date(now.getTime() - 4 * 60 * 1000);
  const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000);
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

  await prisma.checkResult.createMany({
    data: [
      {
        monitorId: apiMonitor.id,
        region: "US",
        status: "UP",
        statusCode: 200,
        latencyms: 142,
        scheduledAt: fiveMinutesAgo,
        checkedAt: fiveMinutesAgo,
      },
      {
        monitorId: apiMonitor.id,
        region: "EU",
        status: "UP",
        statusCode: 200,
        latencyms: 188,
        scheduledAt: fourMinutesAgo,
        checkedAt: fourMinutesAgo,
      },
      {
        monitorId: docsMonitor.id,
        region: "IN",
        status: "DOWN",
        statusCode: 503,
        latencyms: 0,
        error: "Service unavailable",
        scheduledAt: threeMinutesAgo,
        checkedAt: threeMinutesAgo,
      },
      {
        monitorId: docsMonitor.id,
        region: "US",
        status: "UP",
        statusCode: 200,
        latencyms: 231,
        scheduledAt: twoMinutesAgo,
        checkedAt: twoMinutesAgo,
      },
    ],
  });

  const openIncident = await prisma.incident.create({
    data: {
      monitorId: docsMonitor.id,
      scope: IncidentScope.REGION,
      region: "IN",
      status: IncidentStatus.OPEN,
      openedAt: threeMinutesAgo,
    },
    select: { id: true },
  });

  await prisma.alert.create({
    data: {
      incidentId: openIncident.id,
      type: AlertType.INCIDENT_OPENED,
      channel: "email",
      status: AlertStatus.SENT,
    },
  });

  const resolvedIncident = await prisma.incident.create({
    data: {
      monitorId: apiMonitor.id,
      scope: IncidentScope.GLOBAL,
      status: IncidentStatus.RESOLVED,
      openedAt: new Date(now.getTime() - 30 * 60 * 1000),
      closedAt: new Date(now.getTime() - 20 * 60 * 1000),
    },
    select: { id: true },
  });

  await prisma.alert.createMany({
    data: [
      {
        incidentId: resolvedIncident.id,
        type: AlertType.INCIDENT_OPENED,
        channel: "email",
        status: AlertStatus.SENT,
      },
      {
        incidentId: resolvedIncident.id,
        type: AlertType.INCIDENT_RESOLVED,
        channel: "email",
        status: AlertStatus.SENT,
      },
    ],
  });

  console.log("Seed completed");
  console.log(`User: ${TEST_USER_EMAIL} (password: Test@12345)`);
  console.log(`Monitors: ${apiMonitor.name}, ${docsMonitor.name}`);
}

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
