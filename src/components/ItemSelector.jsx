import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { POPULAR_ITEMS } from '../constants/itemConfig';

const ItemSelector = ({ currentItemId, onItemChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentItem = POPULAR_ITEMS.find(item => item.id === currentItemId);

  const filteredItems = POPULAR_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.acronym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemSelect = (itemId) => {
    onItemChange(itemId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/20 transition-all"
      >
        <span className="font-medium">{currentItem?.name || 'Select Item'}</span>
        <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 w-80 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    item.id === currentItemId ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.acronym} • ID: {item.id}
                      </div>
                    </div>
                    {item.id === currentItemId && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
              {filteredItems.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No items found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemSelector;
