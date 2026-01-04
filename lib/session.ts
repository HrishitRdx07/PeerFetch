import { cookies } from 'next/headers';
import { prisma } from './prisma';

const SESSION_COOKIE_NAME = 'peerfetch_session';

export async function createSession(userId: string) {
    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Store session in database
    await prisma.session.create({
        data: {
            token: sessionToken,
            userId,
            expiresAt,
        },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return sessionToken;
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        // Look up session in database
        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: { user: true },
        });

        if (!session) {
            return null;
        }

        // Check if session has expired
        if (session.expiresAt < new Date()) {
            // Delete expired session
            await prisma.session.delete({
                where: { id: session.id },
            });
            return null;
        }

        const { password: _, ...userWithoutPassword } = session.user;
        return userWithoutPassword;
    } catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
}

export async function destroySession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
        try {
            // Delete session from database
            await prisma.session.deleteMany({
                where: { token: sessionToken },
            });
        } catch (error) {
            console.error('Error destroying session:', error);
        }
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
}

function generateSessionToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
