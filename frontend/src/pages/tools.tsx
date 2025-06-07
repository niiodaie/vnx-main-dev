import React, { useEffect, useState } from 'react';

interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  link: string;
}

const ToolsPage: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tools`);
        const data = await response.json();
        setTools(data);
      } catch (error) {
        console.error('Failed to load tools:', error);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="p-4 border rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{tool.name}</h2>
            <p className="text-sm text-gray-600">{tool.description}</p>
            <a href={tool.link} className="text-blue-500 hover:underline mt-2 inline-block">Visit</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
