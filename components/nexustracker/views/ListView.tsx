'use client';

import { Task } from '@/lib/nexustracker/types';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';

interface ListViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const priorityColors = {
  low: 'text-gray-600',
  medium: 'text-blue-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

const statusColors = {
  'todo': 'bg-gray-200 text-gray-800',
  'in-progress': 'bg-blue-200 text-blue-800',
  'review': 'bg-purple-200 text-purple-800',
  'done': 'bg-green-200 text-green-800',
};

export default function ListView({ tasks, onTaskClick }: ListViewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
        <div className="col-span-4">Task</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-2">Assignee</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-1">Time</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

            return (
              <div
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                {/* Task Title */}
                <div className="col-span-4">
                  <div className="flex items-start gap-2">
                    <div className={`w-1 h-1 rounded-full mt-2 ${priorityColors[task.priority]}`} />
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h4>
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {task.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[task.status]}`}>
                    {task.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Priority */}
                <div className="col-span-1 flex items-center">
                  <span className={`text-sm font-medium ${priorityColors[task.priority]}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>

                {/* Assignee */}
                <div className="col-span-2 flex items-center">
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      {task.assignee.avatar ? (
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                          {task.assignee.name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-gray-700">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Unassigned
                    </span>
                  )}
                </div>

                {/* Due Date */}
                <div className="col-span-2 flex items-center">
                  {task.dueDate ? (
                    <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {isOverdue && <AlertCircle className="w-4 h-4 ml-1" />}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No due date</span>
                  )}
                </div>

                {/* Time */}
                <div className="col-span-1 flex items-center">
                  {task.estimatedHours ? (
                    <div className="flex items-center gap-1 text-sm text-gray-700">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimatedHours}h</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400">
            No tasks to display
          </div>
        )}
      </div>
    </div>
  );
}

