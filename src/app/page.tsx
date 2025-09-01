'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

interface ApiResponse {
  status: string;
  data: {
    tasks: Task[];
    nbHits: number;
  };
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formAlert, setFormAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [newTaskName, setNewTaskName] = useState('');

  const showTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/api/v1/tasks');
      console.log('API Response:', data); // Debug log
      setTasks(data.data.tasks); // Access tasks from data.data.tasks
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      setFormAlert({ 
        message: error.response?.data?.msg || 'There was an error, please try later...', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    showTasks();
  }, []);

  const deleteTask = async (id: string) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/api/v1/tasks/${id}`);
      await showTasks();
      setFormAlert({ message: 'Task deleted successfully', type: 'success' });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      setFormAlert({ 
        message: error.response?.data?.msg || 'Error deleting task', 
        type: 'error' 
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      await apiClient.post('/api/v1/tasks', { name: newTaskName });
      setNewTaskName('');
      await showTasks();
      setFormAlert({ message: 'Success, task added', type: 'success' });
    } catch (error: any) {
      console.error('Error adding task:', error);
      setFormAlert({ 
        message: error.response?.data?.msg || 'Error, please try again', 
        type: 'error' 
      });
    }

    setTimeout(() => {
      setFormAlert(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-black dark:text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2">Task Manager</h1>
          <p className="text-gray-600 dark:text-stone-300">Manage your tasks efficiently</p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 ">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="e.g. wash dishes"
              className="flex-1 px-4 py-3 border bg-white placeholder-gray-500 border-gray-300 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Form Alert */}
        {formAlert && (
          <div
            className={`p-4 rounded-lg border mb-6 ${
              formAlert.type === 'success'
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

        {/* Tasks List Container */}
        <div className="tasks-container bg-white dark:bg-slate-900 text-black dark:text-white rounded-lg shadow-md border border-gray-200 p-6">
          {/* Loading Text */}
          {isLoading && (
            <p className="loading-text text-center text-gray-600  py-4">
              Loading...
            </p>
          )}

          {/* Tasks List */}
          <div className="tasks space-y-3 ">
            {!isLoading && tasks?.length === 0 ? (
              <div className="empty-list text-center py-12 ">
                <div className="text-gray-400 mb-4 ">
                  <svg className="w-16 h-16 mx-auto " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h5 className="text-gray-600 text-lg font-medium">No tasks in your list</h5>
                <p className="text-gray-500 mt-2">Add a task above to get started!</p>
              </div>
            ) : (
              tasks?.map((task) => (
                <div
                  key={task._id}
                  className={`single-task group bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-between transition-all duration-200 hover:shadow-md ${
                    task.completed ? 'opacity-75 task-completed' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Status Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 text-transparent'
                    }`}>
                      {task.completed && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {/* Task Name */}
                    <div className="flex-1">
                      <h5 className={`text-lg font-medium ${
                        task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {task.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        Status: {task.completed ? 'Completed' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    {/* Edit Link */}
                    <Link
                      href={`/edit-task?id=${task._id}`}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="Edit task"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      title="Delete task"
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Task Count */}
          {tasks?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 dark:text-stone-300 text-center">
                Total tasks: {tasks.length}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}