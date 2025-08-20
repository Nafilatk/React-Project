import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSave, FiImage } from 'react-icons/fi';
import axios from 'axios';

const ProductsAdmin = () => {
  const colors = {
    primary: "#0B2B26",
    secondary: "#1A5347",
    accent: "#8EB69B",
    highlight: "#DAF1DE",
    background: "#F5F5F5",
    card: "#FFFFFF",
    textDark: "#383832",
    textLight: "#FFFFFF"
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: [''],
    isActive: true
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
      
      toast.success("User deleted successfully");

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId === 'new') {
        await axios.post('http://localhost:5000/products', formData);
      } else {
        await axios.put(`http://localhost:5000/products/${editingId}`, formData);
      }
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: [...product.images],
      isActive: product.isActive
    });
  };

  return (
    <div className="min-h-screen p-5" style={{ backgroundColor: colors.background }}>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
        <h1 className="text-2xl font-bold" style={{ color: colors.primary }}>
          Manage Products
        </h1>
        <button 
          onClick={() => {
            setEditingId('new');
            setFormData({
              name: '',
              description: '',
              price: '',
              stock: '',
              category: '',
              images: [''],
              isActive: true
            });
          }}
          className="px-4 py-2 rounded flex items-center gap-2 transition hover:opacity-90"
          style={{ 
            backgroundColor: colors.secondary, 
            color: colors.textLight 
          }}
        >
          <FiPlus size={16} />
          Add Product
        </button>
      </div>

      {editingId && (
        <div className="p-5 rounded-lg shadow mb-5" style={{ 
          backgroundColor: colors.card,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: colors.primary }}>
            {editingId === 'new' ? 'Add New Product' : 'Edit Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.textDark }}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm" style={{ color: colors.textDark }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded min-h-[80px] focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.textDark }}>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.textDark }}>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.textDark }}>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm" style={{ color: colors.textDark }}>Status</label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm" style={{ color: colors.textDark }}>Image URLs</label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 rounded text-white transition hover:bg-red-600"
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="px-4 py-2 rounded mt-2 flex items-center gap-2 transition hover:bg-opacity-90"
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.textDark
                }}
              >
                <FiPlus /> Add Another Image
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                type="submit"
                className="px-4 py-2 rounded flex items-center gap-2 transition hover:bg-opacity-90"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: colors.textLight
                }}
              >
                <FiSave /> Save
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 rounded transition hover:bg-gray-200"
                style={{ 
                  backgroundColor: colors.background
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div 
            className="w-10 h-10 border-4 rounded-full animate-spin"
            style={{ 
              borderColor: colors.primary,
              borderTopColor: 'transparent'
            }}
          ></div>
        </div>
      ) : (
        <div className="rounded-lg shadow overflow-hidden overflow-x-auto" style={{ 
          backgroundColor: colors.card,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ backgroundColor: colors.primary }}>
                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.textLight }}>Image</th>
                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.textLight }}>Name</th>
                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.textLight }}>Price</th>
                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.textLight }}>Stock</th>
                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.textLight }}>Category</th>
                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.textLight }}>Status</th>
                <th className="p-3 text-left text-sm font-medium" style={{ color: colors.textLight }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  className="border-b border-gray-200 hover:bg-green-50 transition"
                >
                  <td className="p-3">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colors.primary.replace('#', '%23')}"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>`;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                        <FiImage size={20} style={{ color: colors.primary }} />
                      </div>
                    )}
                  </td>
                  <td className="p-3" style={{ color: colors.textDark, fontWeight: '500' }}>{product.name}</td>
                  <td className="p-3" style={{ color: colors.secondary }}>₹{product.price}</td>
                  <td className="p-3 font-medium" style={{ color: product.stock > 0 ? colors.accent : '#EF4444' }}>
                    {product.stock}
                  </td>
                  <td className="p-3" style={{ color: colors.textDark }}>{product.category}</td>
                  <td className="p-3">
                    <span className="font-medium" style={{ color: product.isActive ? colors.accent : '#EF4444' }}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => startEdit(product)}
                        className="p-1 rounded transition hover:bg-green-100"
                        style={{ color: colors.secondary }}
                      >
                        <FiEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1 rounded transition hover:bg-red-100"
                        style={{ color: '#EF4444' }}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;