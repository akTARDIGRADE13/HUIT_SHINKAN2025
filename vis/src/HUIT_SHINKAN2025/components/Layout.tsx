// src/components/Layout.tsx
import React, { ReactNode } from 'react';

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-xl">Weighted Lights-Out Visualizer</h1>
    </header>
    <main className="flex-grow w-full max-w-4xl mx-auto px-8 py-8">
      {children}
    </main>
    <footer className="bg-gray-100 text-center p-4">
      © 2025 My Visualizer
    </footer>
  </div>
);
