import { FastifyInstance } from "fastify";
import { Prisma } from "@prisma/client";
import { hashPassword, verifyPassword } from "../../utils/password.js";

async function signUpUser(
    app: FastifyInstance,
    email: string,
    password: string
) {
    const hashedPassword = await hashPassword(password);
    try {
        const user = await app.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }, select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        return user;
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
            throw new Error('User Already exists')
        }
        throw e;
    }
}


async function logIn(
    app: FastifyInstance,
    email: string,
    password: string
) {
    const existing = await app.prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!existing) {
        throw new Error('User Does Not Exists')
    }
    const isValid = await verifyPassword(password, existing.password);
    if (!isValid) {
        throw new Error('Invalid Password')
    }
    const accessToken = app.jwt.sign({
        sub: existing.id,
        email: existing.email
    });
    return accessToken;
}

export async function getUserProfile(app: FastifyInstance, userId: string) {
    const user = await app.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!user) throw new Error("User not found");

    const monitors = await app.prisma.monitor.findMany({
        where: { userId, isActive: true },
        select: {
            id: true,
            incidens: {
                where: { scope: 'GLOBAL', status: 'OPEN' }
            }
        }
    });

    const totalMonitors = monitors.length;
    let downMonitors = 0;

    for (const monitor of monitors) {
        if (monitor.incidens.length > 0) {
            downMonitors++;
        }
    }

    return {
        user,
        stats: {
            totalMonitors,
            upMonitors: totalMonitors - downMonitors,
            downMonitors
        }
    };
}

export async function changePassword(app: FastifyInstance, userId: string, currentPass: string, newPass: string) {
    const user = await app.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const isValid = await verifyPassword(currentPass, user.password);
    if (!isValid) throw new Error("Invalid current password");

    const newHashed = await hashPassword(newPass);

    await app.prisma.user.update({
        where: { id: userId },
        data: { password: newHashed }
    });
}

export {
    signUpUser,
    logIn
}
