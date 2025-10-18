'use client';

import { Task, TaskStatus } from '@/lib/nexustracker/types';
import TaskCard from '../tasks/TaskCard';
import { Plus } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'bg-gray-100' },
  { status: 'in-progress', label: 'In Progress', color: 'bg-blue-100' },
  { status: 'review', label: 'Review', color: 'bg-purple-100' },
  { status: 'done', label: 'Done', color: 'bg-green-100' },
];

export default function KanbanView({ tasks, onTaskClick }: KanbanViewProps) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);

        return (
          <div
            key={column.status}
            className="flex-shrink-0 w-80"
          >
            {/* Column Header */}
            <div className={`${column.color} rounded-lg p-4 mb-4`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {column.label}
                  <span className="ml-2 text-sm text-gray-600">({columnTasks.length})</span>
                </h3>
                <button
                  className="p-1 hover:bg-white/50 rounded transition-colors"
                  title="Add task"
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

