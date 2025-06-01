export default function PillarsSection() {
  const pillars = [
    {
      id: "tools",
      icon: "🛠️",
      title: "Tools",
      description: "Cutting-edge AI tools and utilities to enhance productivity and creativity",
    },
    {
      id: "platforms",
      icon: "📦",
      title: "Platforms",
      description: "Comprehensive platforms for development, collaboration, and innovation",
    },
    {
      id: "directories",
      icon: "🗂️",
      title: "Directories",
      description: "Curated collections of resources, tools, and services organized for easy discovery",
    },
    {
      id: "resources",
      icon: "📚",
      title: "Resources",
      description: "Educational content, guides, and documentation to accelerate your learning",
    },
    {
      id: "community",
      icon: "💬",
      title: "Community",
      description: "Connect with like-minded innovators, share ideas, and collaborate on projects",
    },
    {
      id: "marketplace",
      icon: "🛍️",
      title: "Marketplace",
      description: "Buy, sell, and discover digital assets, services, and solutions",
    },
    {
      id: "insights",
      icon: "📊",
      title: "Insights",
      description: "Data-driven analytics, market trends, and strategic intelligence",
    },
    {
      id: "experience",
      icon: "✨",
      title: "Experience",
      description: "Immersive features for travel, exploration, and AI-powered storytelling",
    },
  ];

  const handleExplore = (pillarId: string) => {
    console.log(`Exploring ${pillarId} pillar`);
    // Navigation logic would go here
  };

  return (
    <section id="pillars" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Explore Our Platform Pillars
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
              <button
                onClick={() => handleExplore(pillar.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
