import { connectDB } from '@/lib/db/mongoose';
import Task from '@/lib/models/Task';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/tasks/[id] - Get single task
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()
        const task = await Task.findById( params.id );

        if (!task) {
            return NextResponse.json(
                { msg: `No task with id: ${params.id}` },
                { status: 404 }
            );
        }

        return NextResponse.json({ task }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { msg: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/v1/tasks/[id] - Update task
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()
        const body = await request.json();
        const task = await Task.findByIdAndUpdate(
            params.id,
            body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return NextResponse.json(
                { msg: `No task with id: ${params.id}` },
                { status: 404 }
            );
        }

        return NextResponse.json({ task }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { msg: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/v1/tasks/[id] - Delete task
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB()
        const task = await Task.findByIdAndDelete(params.id);

        if (!task) {
            return NextResponse.json(
                { msg: `No task with id: ${params.id}` },
                { status: 404 }
            );
        }

        return NextResponse.json({ task: null, status: 'success' }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { msg: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}