"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { GraduationCap, BookOpen, Video, Award, Users, Clock } from "lucide-react";

export default function TrainingHubPage() {
  const courses = [
    { title: "AI Fundamentals", students: 1234, duration: "6 weeks", level: "Beginner", rating: 4.8 },
    { title: "Web Development", students: 2456, duration: "8 weeks", level: "Intermediate", rating: 4.9 },
    { title: "Data Science", students: 987, duration: "10 weeks", level: "Advanced", rating: 4.7 },
    { title: "Digital Marketing", students: 1567, duration: "4 weeks", level: "Beginner", rating: 4.6 }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Training Hub</h1>
            <p className="text-xl text-white/90 mb-10">Professional training and skill development for the digital age</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Featured Courses</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((course, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-40 bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/80" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-800">{course.title}</h3>
                      <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {course.level}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Award className="w-4 h-4" />
                        <span>⭐ {course.rating} rating</span>
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Learning Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl text-center">
                <Video className="w-12 h-12 mx-auto mb-4 text-violet-600" />
                <h3 className="font-bold text-slate-800 mb-2">Video Lessons</h3>
                <p className="text-sm text-slate-600">HD video content</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold text-slate-800 mb-2">Resources</h3>
                <p className="text-sm text-slate-600">Downloadable materials</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 rounded-xl text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-fuchsia-600" />
                <h3 className="font-bold text-slate-800 mb-2">Certificates</h3>
                <p className="text-sm text-slate-600">Earn credentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}