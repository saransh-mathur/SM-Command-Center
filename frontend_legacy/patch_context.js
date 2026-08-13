const fs = require('fs');

let content = fs.readFileSync('src/context/DashboardContext.tsx', 'utf8');

// Replace the `targets` initialization
content = content.replace(
/const \[targets, setTargets\] = useState<DailyTargets>\(\(\) => \{[\s\S]*?return DEFAULT_TARGETS;\n  \}\);/g,
`const [targets, setTargets] = useState<DailyTargets>(DEFAULT_TARGETS);`
);

// Replace the `applications` initialization
content = content.replace(
/const \[applications, setApplications\] = useState<CareerApplication\[\]>\(\(\) => \{[\s\S]*?return INITIAL_APPLICATIONS;\n  \}\);/g,
`const [applications, setApplications] = useState<CareerApplication[]>(INITIAL_APPLICATIONS);`
);

// Replace the `courses` initialization
content = content.replace(
/const \[courses, setCourses\] = useState<UdemyCourse\[\]>\(\(\) => \{[\s\S]*?return ACTIVE_UDEMY_COURSES;\n  \}\);/g,
`const [courses, setCourses] = useState<UdemyCourse[]>(ACTIVE_UDEMY_COURSES);`
);

// Replace the localStorage save blocks with a useEffect that syncs everything from/to the backend
const syncEffect = `
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initial Fetch from PostgreSQL AppState
  useEffect(() => {
    const fetchState = async () => {
      try {
        const [targetsRes, appsRes, coursesRes] = await Promise.all([
          fetch(\`\${API_BASE}/app-state/targets\`),
          fetch(\`\${API_BASE}/app-state/applications\`),
          fetch(\`\${API_BASE}/app-state/courses\`)
        ]);
        
        if (targetsRes.ok) {
          const data = await targetsRes.json();
          if (data.value) setTargets(data.value);
        }
        if (appsRes.ok) {
          const data = await appsRes.json();
          if (data.value) setApplications(data.value);
        }
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          if (data.value) setCourses(data.value);
        }
      } catch (e) {
        console.error('Failed to load state from backend:', e);
      } finally {
        setDataLoaded(true);
      }
    };
    fetchState();
  }, []);

  // Save to PostgreSQL AppState when things change (only after initial load)
  useEffect(() => {
    if (!dataLoaded) return;
    fetch(\`\${API_BASE}/app-state/targets\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targets)
    }).catch(() => {});
  }, [targets, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    fetch(\`\${API_BASE}/app-state/applications\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applications)
    }).catch(() => {});
  }, [applications, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    fetch(\`\${API_BASE}/app-state/courses\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courses)
    }).catch(() => {});
  }, [courses, dataLoaded]);
`;

content = content.replace(
/\/\/ Save targets & apps to localStorage on change[\s\S]*?\}, \[courses\]\);/g,
syncEffect.trim()
);

fs.writeFileSync('src/context/DashboardContext.tsx', content, 'utf8');
console.log('Context patched successfully');
