import React from 'react';
import { Product } from '../../context/ProductContext';

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div
      className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 relative hover:shadow-md transition-all"
    >
      <div className="font-semibold text-gray-900 text-base">{product.name}</div>

      {product.description && (
        <div className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</div>
      )}

      <div className="mt-2 flex justify-between items-center">
        <span className="text-gray-800 font-medium">₹{product.price}</span>
        <span className="text-xs text-gray-400">Stock: {product.stock}</span>
      </div>

      {product.images && product.images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md border border-gray-200 flex-shrink-0"
            />
          ))}
        </div>
      )}

      <div className="flex justify-end space-x-2 mt-3">
        <button
          onClick={() => onEdit(product)}
          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ProductCard;
