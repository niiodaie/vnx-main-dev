'use client';

import { Project } from '@/lib/nexustracker/types';
import { Calendar, Users, TrendingUp } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const statusLabels = {
  planning: 'Planning',
  active: 'Active',
  'on-hold': 'On Hold',
  completed: 'Completed',
  archived: 'Archived',
};

const statusColors = {
  planning: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  'on-hold': 'bg-orange-100 text-orange-700',
  completed: 'bg-blue-100 text-blue-700',
  archived: 'bg-gray-100 text-gray-700',
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: project.color }}
          >
            {project.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[project.status]}`}>
              {statusLabels[project.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Progress
          </span>
          <span className="font-semibold text-gray-900">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${project.progress}%`,
              backgroundColor: project.color,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {/* Team Members */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                title={member.name}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
            {project.members.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                +{project.members.length - 4}
              </div>
            )}
          </div>
        </div>

        {/* Due Date */}
        {project.endDate && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

