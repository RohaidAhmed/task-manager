import { connectDB } from '@/lib/db/mongoose';
import Task from '@/lib/models/Task';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/tasks - Get all tasks
export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const tasks = await Task.find({});
        return NextResponse.json({
            status: "success",
            data: {
                tasks,
                nbTasks: tasks.length
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { msg: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/v1/tasks - Create a new task
export async function POST(request: NextRequest) {
    try {
        await connectDB()
        const body = await request.json();
        const task = await Task.create(body);
        return NextResponse.json({ task }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { msg: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}