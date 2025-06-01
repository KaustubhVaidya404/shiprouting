import React from 'react';
import RoutePlanner from './components/RoutePlanner';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold">ShipRoutify</h1>
          <p className="text-sm">Maritime Route Planning Tool</p>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <section className="bg-white rounded-lg shadow-lg overflow-hidden h-auto" style={{ minHeight: '800px' }}>
          <RoutePlanner />
        </section>
      </main>
      
      <footer className="container mx-auto py-6 px-4 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} ShipRoutify - Maritime Route Planning Application</p>
        <p className="mt-1">A demonstration of A* pathfinding for maritime shipping routes</p>
      </footer>
    </div>
  );
}

export default App;
