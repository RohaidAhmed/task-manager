import { connectDB } from '@/lib/db/mongoose';
import Task from '@/lib/models/Task';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/tasks/[id] - Get single task
export async function GET(
    request: NextRequest,
    ctx: RouteContext<'/api/v1/tasks/[id]'>
) {
    const { id } = await ctx.params;
    try {
        // Await the params to resolve the Promise

        if (!id) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Task ID is required'
                },
                { status: 400 }
            );
        }

        await connectDB();

        const task = await Task.findById(id);

        if (!task) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: `No task found with id: ${id}`
                },
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
                message: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}

// PATCH /api/v1/tasks/[id] - Update task
export async function PATCH(
    request: NextRequest,
    ctx: RouteContext<'/api/v1/tasks/[id]'>
) {
    const { id } = await ctx.params;
    try {
        // Await the params to resolve the Promise

        if (!id) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Task ID is required'
                },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, completed } = body;

        await connectDB();

        const task = await Task.findByIdAndUpdate(
            id,
            { name, completed },
            { new: true, runValidators: true }
        );

        if (!task) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: `No task found with id: ${id}`
                },
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
        console.error('Error updating task:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}

// DELETE /api/v1/tasks/[id] - Delete task
export async function DELETE(
    request: NextRequest,
    ctx: RouteContext<'/api/v1/tasks/[id]'>
) {
    const { id } = await ctx.params;
    try {
        // Await the params to resolve the Promise



        if (!id) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Task ID is required'
                },
                { status: 400 }
            );
        }

        await connectDB();

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: `No task found with id: ${id}`
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: 'success',
            message: 'Task deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: error instanceof Error ? error.message : 'Internal server error'
            },
            { status: 500 }
        );
    }
}