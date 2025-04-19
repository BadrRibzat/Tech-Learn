'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';

interface Lab {
  id: string;
  title: string;
  category: string | null;
}

export default function Dashboard() {
  const [labs, setLabs] = useState<Lab[]>([]);

  useEffect(() => {
    async function fetchLabs() {
      try {
        const response = await fetch('http://localhost:8000/learning/lessons/');
        const data = await response.json();
        console.log('Fetched Labs:', data);
        setLabs(data);
      } catch (error) {
        console.error('Error fetching labs:', error);
      }
    }
    fetchLabs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Tech-Learn Dashboard</h1>
        <ul className="space-y-2">
          {labs.map((lab) => (
            <li key={lab.id || lab.title} className="p-2 border rounded">
              {lab.title} ({lab.category || 'Uncategorized'})
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
