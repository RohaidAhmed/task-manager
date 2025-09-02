'use client';

import { useState, useEffect, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
// import apiClient from '@/lib/axios';
import axios from 'axios';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

function EditTaskContent() {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formAlert, setFormAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [tempName, setTempName] = useState('');

  const searchParams = useSearchParams();
  // console.log(searchParams);
  const id = searchParams.get('id');

  const showTask = async () => {
    if (!id) return;

    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`);
      console.log('API Response:', data);

      // Access the task from data.data.task
      if (data.data && data.data.task) {
        setTask(data.data.task);
      } else {
        throw new Error('Task not found in response');
      }
    } catch (error: any) {
      console.error('Error fetching task:', error);
      setFormAlert({
        message: error.response?.data?.message || 'Error fetching task',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    if (id) {
      showTask();
    }
  }, [id]);

  // ... rest of your component remains the same until the return statement
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !task) return;

    setIsLoading(true);
    setFormAlert(null);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const taskName = formData.get('name') as string;
      const taskCompleted = formData.get('completed') === 'on';

      const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/tasks/${id}`, {
        name: taskName,
        completed: taskCompleted,
      });

      setTask(data.task);
      setTempName(data.task.name);

      setFormAlert({ message: 'Success, edited task', type: 'success' });
    } catch (error: any) {
      console.error('Error updating task:', error);
      setFormAlert({
        message: error.response?.data?.message || 'Error, please try again',
        type: 'error'
      });

      // Reset to previous name on error
      if (task) {
        setTask({ ...task, name: tempName });
      }
    } finally {
      setIsLoading(false);

      // Clear alert after 3 seconds
      setTimeout(() => {
        setFormAlert(null);
      }, 3000);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-red-600">No task ID provided</div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Back to tasks
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="animate-pulse text-gray-600">Loading task...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h4 className="text-2xl font-bold text-center mb-6">Edit Task</h4>

          {/* Task ID */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Task ID</label>
            <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm">{task._id}</p>
          </div>

          {/* Task Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={task.name}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />
          </div>

          {/* Completed Checkbox */}
          <div className="mb-6">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="completed"
                defaultChecked={task.completed}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Completed</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? 'Loading...' : 'Edit Task'}
          </button>

          {/* Form Alert */}
          {formAlert && (
            <div
              className={`mt-4 p-4 rounded-lg border ${formAlert.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
                }`}
            >
              <div className="flex items-center">
                {formAlert.type === 'success' ? (
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {formAlert.message}
              </div>
            </div>
          )}
        </form>

        {/* Back Link */}
        <Link
          href="/"
          className="block mt-6 text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Back to tasks
        </Link>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function EditTask() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      </div>
    }>
      <EditTaskContent />
    </Suspense>
  );
}