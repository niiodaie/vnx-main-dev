import React, { useEffect, useState } from 'react';

const ToolsPage = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tools`)
      .then(res => res.json())
      .then(data => setTools(data))
      .catch(err => console.error('Error fetching tools:', err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tools</h1>
      {tools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <ul className="list-disc pl-6">
          {tools.map((tool: any, index: number) => (
            <li key={index}>{tool.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToolsPage;
