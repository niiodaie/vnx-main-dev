'use client';

import { Task } from '@/lib/nexustracker/types';
import { Calendar, Clock, MessageSquare, Paperclip, CheckSquare, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const statusColors = {
  'todo': 'bg-gray-200 text-gray-800',
  'in-progress': 'bg-blue-200 text-blue-800',
  'review': 'bg-purple-200 text-purple-800',
  'done': 'bg-green-200 text-green-800',
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
    >
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityColors[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
        {isOverdue && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>

      {/* Task Title */}
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {task.title}
      </h3>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Task Meta */}
      <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}

        {task.estimatedHours && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{task.estimatedHours}h</span>
          </div>
        )}

        {task.subtasks.length > 0 && (
          <div className="flex items-center gap-1">
            <CheckSquare className="w-4 h-4" />
            <span>{completedSubtasks}/{task.subtasks.length}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Assignee */}
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
            <span className="text-sm text-gray-700">{task.assignee.name.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}

        {/* Counts */}
        <div className="flex items-center gap-3 text-gray-500">
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">{task.comments.length}</span>
            </div>
          )}
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-4 h-4" />
              <span className="text-xs">{task.attachments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

