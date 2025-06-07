useEffect(() => {
  fetch('/data/tools.json')
    .then(res => res.json())
    .then(setTools);
}, []);
