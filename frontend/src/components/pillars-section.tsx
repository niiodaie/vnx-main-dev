import { Link } from "react-router-dom";

export default function PillarsSection() {
  const pillars = [
    {
      id: "tools",
      path: "/tools",
      icon: "🛠️",
      title: "Tools",
      description: "Handy utilities that solve real-world problems",
    },
    {
      id: "platforms",
      path: "/platforms",
      icon: "🧩",
      title: "Platforms",
      description: "Interactive launchpads and service layers",
    },
    {
      id: "directories",
      path: "/directories",
      icon: "📚",
      title: "Directories",
      description: "Discover niche resources by category",
    },
    {
      id: "resources",
      path: "/resources",
      icon: "🗂️",
      title: "Resources",
      description: "Templates, guides, and downloadable kits",
    },
    {
      id: "community",
      path: "/community",
      icon: "🧑‍🤝‍🧑",
      title: "Community",
      description: "Peer collaboration and feedback forums",
    },
    {
      id: "marketplace",
      path: "/marketplace",
      icon: "🛒",
      title: "Marketplace",
      description: "Digital products, services, and SaaS tools",
    },
    {
      id: "insights",
      path: "/insights",
      icon: "📈",
      title: "Insights",
      description: "Trends, forecasts, and business analytics",
    },
    {
      id: "experiences",
      path: "/experiences",
      icon: "✨",
      title: "Experiences",
      description: "Immersive digital journeys and exploration",
    },
  ];

  return (
    <section id="pillars" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            🧱 Explore Our Pillars
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Eight comprehensive categories designed to accelerate your digital journey and unlock new
            possibilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-100 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{pillar.title}</h3>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">{pillar.description}</p>
              <Link
                to={pillar.path}
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
