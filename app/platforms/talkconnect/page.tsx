"use client";

import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { MessageSquare, Users, Video, Phone, Send, Search } from "lucide-react";

export default function TalkConnectPage() {
  const [message, setMessage] = useState("");
  const channels = [
    { name: "General", members: 234, unread: 5 },
    { name: "Development", members: 89, unread: 12 },
    { name: "Design", members: 56, unread: 3 },
    { name: "Marketing", members: 123, unread: 0 }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">TalkConnect</h1>
            <p className="text-xl text-white/90 mb-10">Team communication and collaboration platform for modern teams</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Channels</h2>
                  <button className="p-2 hover:bg-slate-100 rounded-lg">
                    <Search className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
                <div className="space-y-2">
                  {channels.map((channel, idx) => (
                    <div key={idx} className="p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700"># {channel.name}</span>
                          {channel.unread > 0 && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                              {channel.unread}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{channel.members}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800"># General</h2>
                    <p className="text-sm text-slate-600">234 members</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <Phone className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <Video className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <Users className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="h-96 overflow-y-auto mb-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">John Doe</span>
                        <span className="text-xs text-slate-500">10:30 AM</span>
                      </div>
                      <p className="text-slate-700">Welcome to TalkConnect! 👋</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      SM
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-800">Sarah Miller</span>
                        <span className="text-xs text-slate-500">10:32 AM</span>
                      </div>
                      <p className="text-slate-700">Great to be here! Looking forward to collaborating.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-bold text-slate-800 mb-2">Real-time Chat</h3>
                <p className="text-sm text-slate-600">Instant messaging with your team</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center">
                <Video className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold text-slate-800 mb-2">Video Calls</h3>
                <p className="text-sm text-slate-600">HD video conferencing</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <h3 className="font-bold text-slate-800 mb-2">Team Channels</h3>
                <p className="text-sm text-slate-600">Organized conversations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}