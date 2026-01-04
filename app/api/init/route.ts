import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
    try {
        // Step 1: Push schema to database
        console.log('Pushing Prisma schema to database...');
        const { stdout: pushOutput, stderr: pushError } = await execAsync('npx prisma db push --accept-data-loss');

        if (pushError) {
            console.error('Prisma push stderr:', pushError);
        }
        console.log('Prisma push output:', pushOutput);

        // Step 2: Generate Prisma Client
        console.log('Generating Prisma Client...');
        const { stdout: generateOutput } = await execAsync('npx prisma generate');
        console.log('Prisma generate output:', generateOutput);

        // Step 3: Seed the database
        console.log('Seeding database...');
        const { stdout: seedOutput } = await execAsync('npm run db:seed');
        console.log('Seed output:', seedOutput);

        return NextResponse.json({
            success: true,
            message: 'Database initialized and seeded successfully!',
            steps: {
                schemaPushed: true,
                clientGenerated: true,
                dataSeeded: true
            },
            credentials: {
                admin: {
                    studentId: 'ADMIN001',
                    password: 'admin123'
                },
                student: {
                    studentId: '25EL001',
                    password: 'password123'
                }
            }
        });

    } catch (error: any) {
        console.error('Init error:', error);
        return NextResponse.json({
            error: 'Database initialization failed',
            details: error.message,
            stdout: error.stdout,
            stderr: error.stderr
        }, { status: 500 });
    }
}
