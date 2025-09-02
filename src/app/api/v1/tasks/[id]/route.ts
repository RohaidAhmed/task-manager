import { connectDB } from '@/lib/db/mongoose';
import Task from '@/lib/models/Task';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/tasks/[id] - Get single task
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await the params to resolve the Promise
        const { id } = await params;
        
        if (!id) {
            return NextResponse.json(
                { msg: 'Task ID is required' },
                { status: 400 }
            );
        }

        await connectDB();
        
        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                { msg: `No task found with id: ${id}` },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            status: 'success',
            data: {
                task: task
            }
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching task:', error);
        return NextResponse.json(
            { 
                status: 'error',
                msg: error instanceof Error ? error.message : 'Internal server error' 
            },
            { status: 500 }
        );
    }
}

// PUT /api/v1/tasks/[id] - Update task
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params
        const body = await request.json();
        const task = await Task.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return NextResponse.json(
                { msg: `No task with id: ${id}` },
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return NextResponse.json(
                { msg: `No task with id: ${id}` },
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