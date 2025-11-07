"use client";
import React, { useState } from 'react';
import Navbar from '@/app/component/Navbar';
import type { ViewType } from '@/app/component/Navbar';
import type { Product } from '@/app/store/product';
import HomePage from '@/app/component/Home/Page';
import CreateProductPage from '@/app/component/CreatePage/page';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
<div style={{ paddingTop: '64px' }}>
        {currentView === 'home' ? (
          <HomePage 
            setCurrentView={setCurrentView} 
            setEditingProduct={setEditingProduct}
          />
        ) : (
          <CreateProductPage 
            setCurrentView={setCurrentView}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
          />
        )}
      </div>
    </div>
  );
}