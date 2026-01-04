import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface User {
    id: string;
    studentId: string;
    name: string;
    email: string | null;
    branch: string;
    year: number;
    batch: number;
    isApproved: boolean;
    isAdmin: boolean;
    profilePicture: string | null;
    bio: string | null;
    skills: string | null;
    extracurriculars: string | null;
}

export async function authenticate(studentId: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: { studentId },
    });

    if (!user) {
        return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function createUser(data: {
    studentId: string;
    password: string;
    name: string;
    email?: string;
    branch: string;
    year: number;
    batch: number;
}) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            isApproved: false,
            isAdmin: false,
        },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function validateStudentId(studentId: string): Promise<{ valid: boolean; error?: string }> {
    // Format: 25EL011 (batch + branch + roll)
    const pattern = /^(\d{2})(EL|CP|EC|EE|ME|CE|PE|IT)(\d{3})$/;

    if (!pattern.test(studentId)) {
        return {
            valid: false,
            error: 'Invalid format. Use format like 25EL011 (year + branch + roll)',
        };
    }

    // Check if already exists
    const existing = await prisma.user.findUnique({
        where: { studentId },
    });

    if (existing) {
        return {
            valid: false,
            error: 'Student ID already registered',
        };
    }

    return { valid: true };
}

export function parseStudentId(studentId: string) {
    const pattern = /^(\d{2})(EL|CP|EC|EE|ME|CE|PE|IT)(\d{3})$/;
    const match = studentId.match(pattern);

    if (!match) {
        return null;
    }

    const [, batchYear, branch, roll] = match;
    const batch = 2000 + parseInt(batchYear);
    const currentYear = new Date().getFullYear();
    const year = currentYear - batch + 1;

    return {
        batch,
        branch,
        year: Math.max(1, Math.min(4, year)),
        roll,
    };
}
