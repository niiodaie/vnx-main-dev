const [tools, setTools] = useState([]);

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tools`)
    .then(res => res.json())
    .then(data => setTools(data))
    .catch(err => console.error('Error fetching tools:', err));
}, []);
