import { useEffect, useState } from 'react';

const ToolsPage = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tools`)
      .then(res => res.json())
      .then(data => setTools(data))
      .catch(err => console.error('Error fetching tools:', err));
  }, []);

  return (
    <div>
      <h1>All Tools</h1>
      <ul>
        {tools.map((tool: any) => (
          <li key={tool.id}>{tool.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ToolsPage;
