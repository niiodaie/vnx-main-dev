'use client';

import { useState } from 'react';
import type { Metadata } from "next";
import { LayoutGrid, List, Calendar, BarChart3, Plus, Search, Filter, Settings } from 'lucide-react';
import { mockProjects, mockTasks, mockActivities } from '@/lib/nexustracker/mockData';
import { ViewMode, Project, Task } from '@/lib/nexustracker/types';
import DashboardStats from '@/components/nexustracker/dashboard/DashboardStats';
import ProjectCard from '@/components/nexustracker/projects/ProjectCard';
import KanbanView from '@/components/nexustracker/views/KanbanView';
import ListView from '@/components/nexustracker/views/ListView';

export default function NexusTrackerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks by selected project
  const projectTasks = selectedProject
    ? mockTasks.filter((task) => task.projectId === selectedProject.id)
    : mockTasks;

  // Calculate stats
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in-progress').length;
  const overdueTasks = projectTasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
  ).length;

  const viewModes = [
    { mode: 'kanban' as ViewMode, icon: LayoutGrid, label: 'Kanban' },
    { mode: 'list' as ViewMode, icon: List, label: 'List' },
    { mode: 'calendar' as ViewMode, icon: Calendar, label: 'Calendar' },
    { mode: 'gantt' as ViewMode, icon: BarChart3, label: 'Gantt' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">NexusTracker</h1>
              <p className="text-indigo-100 text-lg">
                Professional Project Management Platform
              </p>
            </div>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>

          {/* Project Selector */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedProject(null)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                !selectedProject
                  ? 'bg-white text-indigo-600'
                  : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
              }`}
            >
              All Projects
            </button>
            {mockProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedProject?.id === project.id
                    ? 'bg-white text-indigo-600'
                    : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <DashboardStats
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          inProgressTasks={inProgressTasks}
          overdueTasks={overdueTasks}
        />

        {/* Projects Overview (when no project selected) */}
        {!selectedProject && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Task Management (when project selected) */}
        {selectedProject && (
          <>
            {/* Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* View Modes */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  {viewModes.map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        viewMode === mode
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title={label}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden sm:inline font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">New Task</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Views */}
            <div className="mb-8">
              {viewMode === 'kanban' && (
                <KanbanView tasks={projectTasks} />
              )}

              {viewMode === 'list' && (
                <ListView tasks={projectTasks} />
              )}

              {viewMode === 'calendar' && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
                  <p className="text-gray-600">
                    Calendar view with task scheduling coming soon
                  </p>
                </div>
              )}

              {viewMode === 'gantt' && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Gantt Chart</h3>
                  <p className="text-gray-600">
                    Gantt chart for timeline visualization coming soon
                  </p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      {activity.user.avatar ? (
                        <img
                          src={activity.user.avatar}
                          alt={activity.user.name}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-indigo-600">
                          {activity.user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.user.name}</span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>
            Powered by{' '}
            <a href="https://visnec.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Visnec
            </a>
            {' '}• Part of the{' '}
            <a href="https://visnec.ai" className="text-indigo-600 hover:text-indigo-700 font-medium">
              VNX Ecosystem
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

