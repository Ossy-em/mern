"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Edit, ShoppingBag, Plus, TrendingUp, DollarSign, Package, Search, Filter, Grid3x3, List, SortAsc, X, Zap } from 'lucide-react';
import type { Product } from '@/app/store/product';

interface HomePageProps {
  setCurrentView: React.Dispatch<React.SetStateAction<'home' | 'create'>>;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

function HomePage({ setCurrentView, setEditingProduct }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (data.data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.error('Unexpected API response structure:', data);
        setProducts([]);
      }

      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string): Promise<void> => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p._id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      alert('Error deleting product: ' + message);
    }
  };

  const handleEdit = (product: Product): void => {
    setEditingProduct(product);
    setCurrentView('create');
  };


  const categories = ['all', ...new Set(products.map(p => p.category || 'Uncategorized').filter(Boolean))];


  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || (product.category || 'Uncategorized') === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case 'price-desc':
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center mt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
          </div>
          <p className="text-slate-700 text-lg font-medium">Loading your gadgets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center mt-16 px-4">
        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 max-w-md w-full shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-red-900 text-xl font-bold mb-2 text-center">Oops! Something went wrong</h3>
          <p className="text-red-700 text-sm mb-6 text-center">{error}</p>
          <button
            onClick={fetchProducts}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >

            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;

  return (
    <div className="min-h-screen w-full bg-slate-50 pt-16 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">

        <div className="pt-8 pb-6 sm:pt-12 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                  Gadget Store
                </h1>
              </div>
              <p className="text-slate-600 text-sm sm:text-base">Discover the latest tech innovations</p>
            </div>
            <button
              onClick={() => setCurrentView('create')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span>Add Gadget</span>
            </button>
          </div>

          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Gadgets</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">{products.length}</p>

                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Avg. Price</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">${avgPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Value</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">${totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

 
          {products.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search gadgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-medium text-slate-700"
                  >
                    <Filter className="w-5 h-5" />
                    <span className="hidden sm:inline">Filter</span>
                    {selectedCategory !== 'all' && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}

                  </button>

                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-10 p-2">
                      <div className="text-xs font-semibold text-slate-500 uppercase px-3 py-2">Categories</div>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedCategory === cat
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'hover:bg-slate-50 text-slate-700'
                            }`}

                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>


                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-700 cursor-pointer"
                >

                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low-High)</option>
                  <option value="price-desc">Price (High-Low)</option>
                </select>

                <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                        ? 'bg-white text-indigo-600 shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >

                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>


              {(searchQuery || selectedCategory !== 'all') && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
                  {searchQuery && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">

                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:bg-indigo-200 rounded p-0.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {selectedCategory !== 'all' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">

                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} className="hover:bg-purple-200 rounded p-0.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border-2 border-slate-200 shadow-xl">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-blue-600" />

              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No Gadgets Yet</h3>
              <p className="text-slate-600 mb-8 text-sm sm:text-base">Start your collection by adding your first amazing gadget</p>
              <button
                onClick={() => setCurrentView('create')}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >

                <Plus className="w-5 h-5 inline mr-2" />
                Add Your First Gadget
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-slate-200 shadow-lg">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No gadgets found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (

          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
          }>
            {filteredProducts.map((product) => (
              viewMode === 'grid' ? (

                <div
                  key={product._id}
                  className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                    <img
                      src={product.image || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2.5 bg-white hover:bg-indigo-600 text-slate-700 hover:text-white rounded-xl transition-all shadow-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        className="p-2.5 bg-white hover:bg-red-600 text-slate-700 hover:text-white rounded-xl transition-all shadow-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-lg shadow-md">
                          {product.category}
                        </span>

                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">

                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1 font-medium">Price</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                          ${(Number(product.price) || 0).toFixed(2)}
                        </p>

                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2.5 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-xl transition-all duration-200"
                          title="Edit Product"
                        >

                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="p-2.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-xl transition-all duration-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (

                <div
                  key={product._id}
                  className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl"
                >

                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                      />
                      {product.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-semibold rounded-lg shadow-md">
                            {product.category}
                          </span>

                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>

                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                            ${(Number(product.price) || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-xl transition-all duration-200 font-medium flex items-center gap-2"
                        >

                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-700 rounded-xl transition-all duration-200 font-medium flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;