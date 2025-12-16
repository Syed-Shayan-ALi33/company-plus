import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Package, Truck, MoreHorizontal, Filter, Plus, Edit, Check, Trash2, AlertTriangle, PlusCircle, Lock, Phone, User, Eye } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useData } from '../context/DataContext';
import { Modal } from './UIComponents';
import { Order } from '../types';

const PREDEFINED_PRODUCTS = [
  { id: 'p1', name: 'Wireless Handsfree', price: 29.99, icon: '🎧' },
  { id: 'p2', name: 'Leather Handbag', price: 89.99, icon: '👜' },
  { id: 'p3', name: 'Smart Watch', price: 149.50, icon: '⌚' },
  { id: 'p4', name: 'Sunglasses', price: 45.00, icon: '🕶️' }
];

const CommerceManager: React.FC = () => {
  const { showToast } = useUI();
  // Use global data context instead of local state
  const { orders, addOrder, updateOrderStatus, deleteOrder, stats } = useData();
  
  // Modal States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Quick Order Modal State
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<{name: string, price: number} | null>(null);

  // Filter State
  const [activeFilters, setActiveFilters] = useState({
      pending: true,
      delivered: true,
      cancelled: true
  });
  
  // Temp filters for the modal
  const [tempFilters, setTempFilters] = useState(activeFilters);

  // Form States (Shared for both Custom Order and Quick Order)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // Edit/Delete State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<Order['status']>('Pending');

  // Sync temp filters when modal opens
  useEffect(() => {
    if (isFilterOpen) {
        setTempFilters(activeFilters);
    }
  }, [isFilterOpen, activeFilters]);

  // Filtered Orders Logic
  const filteredOrders = useMemo(() => {
      return orders.filter(order => {
          const status = order.status;
          if (activeFilters.pending && (status === 'Pending' || status === 'Processing')) return true;
          if (activeFilters.delivered && (status === 'Delivered' || status === 'Shipped')) return true;
          if (activeFilters.cancelled && status === 'Cancelled') return true;
          return false;
      });
  }, [orders, activeFilters]);

  const handleCreateOrder = (name: string, price: number, cName: string, cPhone: string) => {
    const newOrder: Order = {
        id: `#ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        customer: cName || 'Guest Customer', 
        phone: cPhone,
        product: name,
        amount: price,
        status: 'Pending',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        visibility: 'private' // Defaulting to private as requested
    };
    addOrder(newOrder);
    showToast(`Order created for ${name}`, "success");
  };

  const handleCustomOrderSubmit = () => {
    if (!productName || !productPrice || !customerName) {
        showToast("Please fill in required fields (Product, Price, Name)", "error");
        return;
    }
    handleCreateOrder(productName, parseFloat(productPrice), customerName, customerPhone);
    resetForms();
    setIsAddProductOpen(false);
  };

  const handleQuickOrderSubmit = () => {
      if (!selectedQuickProduct || !customerName) {
          showToast("Please enter customer name", "error");
          return;
      }
      handleCreateOrder(selectedQuickProduct.name, selectedQuickProduct.price, customerName, customerPhone);
      resetForms();
      setSelectedQuickProduct(null);
  };

  const resetForms = () => {
      setProductName('');
      setProductPrice('');
      setCustomerName('');
      setCustomerPhone('');
  };

  const openQuickOrderModal = (name: string, price: number) => {
      setSelectedQuickProduct({ name, price });
      setCustomerName('');
      setCustomerPhone('');
  };

  const openEditModal = (order: Order) => {
      setSelectedOrder(order);
      setEditStatus(order.status);
      setIsEditOrderOpen(true);
  };

  const handleUpdateStatus = () => {
      if (!selectedOrder) return;
      updateOrderStatus(selectedOrder.id, editStatus);
      showToast(`Order ${selectedOrder.id} status updated to ${editStatus}`, "success");
      setIsEditOrderOpen(false);
      setSelectedOrder(null);
  };

  const promptDelete = (order: Order) => {
      setSelectedOrder(order);
      setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
      if (!selectedOrder) return;
      deleteOrder(selectedOrder.id);
      showToast(`Order ${selectedOrder.id} has been deleted`, "info");
      setIsDeleteConfirmOpen(false);
      setSelectedOrder(null);
  };

  const handleTempFilterChange = (key: keyof typeof tempFilters) => {
      setTempFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyFilters = () => {
      setActiveFilters(tempFilters);
      setIsFilterOpen(false);
      showToast("Filters applied", "info");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menu & Order Management</h2>
          <p className="text-gray-500">Track orders and manage your AI-assisted sales catalog.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            <Filter size={16} />
            Filter
          </button>
          <button 
            onClick={() => {
                resetForms();
                setIsAddProductOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm shadow-blue-200 transition-colors"
          >
            <Plus size={16} />
            Custom Order
          </button>
        </div>
      </div>

      {/* Product Catalog / Quick Order */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-500" />
            Product Catalog (Quick Order)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PREDEFINED_PRODUCTS.map(item => (
                <div key={item.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all bg-gray-50 group">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500 mb-3">${item.price.toFixed(2)}</div>
                    <button 
                        onClick={() => openQuickOrderModal(item.name, item.price)}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded text-sm font-medium text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                    >
                        <PlusCircle size={14} />
                        Order Now
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* Live Dashboard Stats from Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending & Processing</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Delivered</p>
            <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm min-h-[400px] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Orders</h3>
          <span className="text-xs text-gray-500 flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             Live Updates
          </span>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Visibility</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                    <td colSpan={8} className="px-6 py-20 text-center text-gray-400 flex flex-col items-center justify-center">
                        <ShoppingBag size={48} className="mb-4 text-gray-200" />
                        <p className="text-lg font-medium text-gray-500">No matching orders found</p>
                        <p className="text-sm">Try adjusting your filters or add a new order.</p>
                    </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                                {order.customer.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-900 text-sm font-medium">{order.customer}</span>
                                {order.phone && <span className="text-gray-400 text-xs">{order.phone}</span>}
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{order.product || 'N/A'}</td>
                    <td className="px-6 py-4">
                        {order.visibility === 'private' ? (
                            <div className="flex items-center gap-1.5 text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 w-fit">
                                <Lock size={12} />
                                <span className="text-xs font-medium">Private to me</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 w-fit">
                                <Eye size={12} />
                                <span className="text-xs font-medium">Public</span>
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{order.date}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${
                        order.status === 'Delivered' || order.status === 'Shipped'
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : order.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : order.status === 'Processing'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                        {order.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-right">
                        ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => openEditModal(order)}
                                className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Status"
                            >
                                <Edit size={16} />
                            </button>
                            <button 
                                onClick={() => promptDelete(order)}
                                className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Order"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Order Modal */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Custom Product Order"
        actionLabel="Create Order"
        onAction={handleCustomOrderSubmit}
        secondaryActionLabel="Cancel"
      >
        <div className="space-y-4">
            <p className="text-sm text-gray-500">
                Create a custom order with specific product details.
            </p>
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="John Doe"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="tel" 
                            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="+1 (555) 000-0000"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. Wireless Headphones"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Value ($) *</label>
                    <input 
                        type="number" 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="0.00"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                </div>
            </div>
        </div>
      </Modal>

      {/* Quick Order Confirmation Modal */}
      <Modal
        isOpen={!!selectedQuickProduct}
        onClose={() => setSelectedQuickProduct(null)}
        title="Complete Quick Order"
        actionLabel="Confirm Order"
        onAction={handleQuickOrderSubmit}
        secondaryActionLabel="Cancel"
      >
        <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 border border-blue-100">
                <ShoppingBag className="text-blue-600" size={20} />
                <div>
                    <p className="font-semibold text-gray-900">{selectedQuickProduct?.name}</p>
                    <p className="text-sm text-gray-500">${selectedQuickProduct?.price.toFixed(2)}</p>
                </div>
            </div>
            
            <p className="text-sm text-gray-500">
                Enter customer details to finalize this order.
            </p>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                        type="tel" 
                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Customer Phone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                </div>
            </div>
        </div>
      </Modal>

      {/* Edit Order Status Modal */}
      <Modal
        isOpen={isEditOrderOpen}
        onClose={() => setIsEditOrderOpen(false)}
        title={`Update Order ${selectedOrder?.id}`}
        actionLabel="Update Status"
        onAction={handleUpdateStatus}
        secondaryActionLabel="Cancel"
      >
          <div className="space-y-4">
              <p className="text-sm text-gray-500">
                  Manually update the fulfillment status for this order.
              </p>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                  <div className="space-y-2">
                      {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                          <label key={status} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                              editStatus === status 
                              ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                              <input 
                                  type="radio" 
                                  name="status" 
                                  value={status} 
                                  checked={editStatus === status}
                                  onChange={(e) => setEditStatus(e.target.value as any)}
                                  className="sr-only"
                              />
                              <span className="flex-1 text-sm font-medium text-gray-900">{status}</span>
                              {editStatus === status && <Check size={16} className="text-blue-600" />}
                          </label>
                      ))}
                  </div>
              </div>
          </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Order"
        actionLabel="Delete"
        onAction={handleDelete}
        secondaryActionLabel="Cancel"
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertTriangle size={32} />
            </div>
            <div className="text-center">
                <p className="text-gray-900 font-medium text-lg">Are you sure?</p>
                <p className="text-gray-500 text-sm mt-1">
                    This will permanently remove order <span className="font-bold text-gray-800">{selectedOrder?.id}</span> from the system. This action cannot be undone.
                </p>
            </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Orders"
        actionLabel="Apply Filters"
        onAction={applyFilters}
        secondaryActionLabel="Close"
      >
          <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 w-4 h-4" 
                    checked={tempFilters.pending}
                    onChange={() => handleTempFilterChange('pending')}
                  />
                  <span className="text-sm text-gray-700">Show Pending & Processing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 w-4 h-4" 
                    checked={tempFilters.delivered}
                    onChange={() => handleTempFilterChange('delivered')}
                  />
                  <span className="text-sm text-gray-700">Show Delivered</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 w-4 h-4" 
                    checked={tempFilters.cancelled}
                    onChange={() => handleTempFilterChange('cancelled')}
                  />
                  <span className="text-sm text-gray-700">Show Cancelled</span>
              </label>
          </div>
      </Modal>
    </div>
  );
};

export default CommerceManager;