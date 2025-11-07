"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { ArrowLeft, Image as ImageIcon, DollarSign, Package, Save, X } from 'lucide-react';
import { Product, CreateProductPayload } from '../store/product';

interface CreatePageProps {
  setCurrentView: (view: string) => void;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

interface FormData {
  name: string;
  price: string;
  image: string;
}

interface FormErrors {
  name?: string;
  price?: string;
  image?: string;
}

function CreateProductPage({ setCurrentView, editingProduct, setEditingProduct }: CreatePageProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    image: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        price: String(editingProduct.price) || '',
        image: editingProduct.image || ''
      });
    }
  }, [editingProduct]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;
    
    setSubmitting(true);
    
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const payload: CreateProductPayload = {
        name: formData.name,
        price: Number(formData.price),
        image: formData.image
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to save product');
      
      setFormData({ name: '', price: '', image: '' });
      setEditingProduct(null);
      setCurrentView('home');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      alert('Error saving product: ' + message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    setFormData({ name: '', price: '', image: '' });
    setEditingProduct(null);
    setCurrentView('home');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">

          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Products</span>
            </button>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h1>
            <p className="text-gray-600">
              {editingProduct ? 'Update your product information' : 'Add a new product to your catalog'}
            </p>
          </div>
          

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="space-y-6">

              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <Package className="w-4 h-4 text-blue-600" />
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="e.g., Premium Wireless Headphones"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.name}
                  </p>
                )}
              </div>
              

              <div>
                <label htmlFor="price" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.price 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.price}
                  </p>
                )}
              </div>
              

              <div>
                <label htmlFor="image" className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <ImageIcon className="w-4 h-4 text-blue-600" />

                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.image 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>•</span> {errors.image}
                  </p>
                )}
                

                {formData.image && !errors.image && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                    <div className="aspect-video max-w-sm bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Invalid+Image';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            

            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
           <button
  type="button"
  onClick={handleSubmit}
  disabled={submitting}
  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl disabled:shadow-none"
>

                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>


          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
  <span className="font-semibold">Tip:</span> Make sure to use high-quality images and accurate pricing for the best results.
</p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProductPage;