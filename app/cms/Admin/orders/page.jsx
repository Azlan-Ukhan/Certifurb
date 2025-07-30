'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../Components/Layout/Layout';
import { font } from "../../../Components/Font/font";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const OrdersPage = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Load orders from API
  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      const response = await fetch(`http://localhost:5000/api/cms/orders?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(data.data.pagination.totalPages);
        setTotalOrders(data.data.pagination.totalItems);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchOrders();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Static dummy data for fallback
  const dummyOrders = [
    {
      id: 1,
      orderNumber: "#2453",
      total: "$87",
      customer: {
        name: "Carry Anna",
        avatar: "/api/placeholder/32/32"
      },
      paymentStatus: { text: "PAID", color: "bg-green-100 text-green-800" },
      fulfillmentStatus: { text: "ORDER FULFILLED", color: "bg-green-100 text-green-800" },
      deliveryType: "Cash on delivery",
      date: "Dec 12, 12:56 PM"
    },
    {
      id: 2,
      orderNumber: "#2452",
      total: "$7,264",
      customer: {
        name: "Mitind Mikuja",
        avatar: "/api/placeholder/32/32"
      },
      paymentStatus: { text: "CANCELLED", color: "bg-gray-100 text-gray-800" },
      fulfillmentStatus: { text: "READY TO PICKUP", color: "bg-blue-100 text-blue-800" },
      deliveryType: "Free shipping",
      date: "Dec 9, 2:28PM"
    },
    {
      id: 3,
      orderNumber: "#2451",
      total: "$375",
      customer: {
        name: "Stanly Drinkwater",
        avatar: "/api/placeholder/32/32"
      },
      paymentStatus: { text: "PENDING", color: "bg-orange-100 text-orange-800" },
      fulfillmentStatus: { text: "PARTIAL FULFILLED", color: "bg-orange-100 text-orange-800" },
      deliveryType: "Local pickup",
      date: "Dec 4, 12:56 PM"
    },
    {
      id: 4,
      orderNumber: "#2450",
      total: "$657",
      customer: {
        name: "Josef Stravinsky",
        avatar: "/api/placeholder/32/32"
      },
      paymentStatus: { text: "CANCELLED", color: "bg-gray-100 text-gray-800" },
      fulfillmentStatus: { text: "ORDER CANCELLED", color: "bg-gray-100 text-gray-800" },
      deliveryType: "Standard shipping",
      date: "Dec 1, 4:07 AM"
    },
    {
      id: 5,
      orderNumber: "#2449",
      total: "$9,562",
      customer: {
        name: "Igor Borvibson",
        avatar: "/api/placeholder/32/32"
      },
      paymentStatus: { text: "FAILED", color: "bg-red-100 text-red-800" },
      fulfillmentStatus: { text: "ORDER FULFILLED", color: "bg-green-100 text-green-800" },
      deliveryType: "Express",
      date: "Nov 28, 7:28 PM"
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-orange-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="text-blue-600 hover:underline cursor-pointer">Page 1</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 hover:underline cursor-pointer">Page 2</span>
          <span className="mx-2">›</span>
          <span>Default</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>

        {/* Status Tabs */}
        <div className="flex items-center space-x-6 mb-6">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
            All <span className="text-gray-500">({totalOrders})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Pending payment <span className="text-gray-500">(0)</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Unfulfilled <span className="text-gray-500">(0)</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Completed <span className="text-gray-500">({totalOrders})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Refunded <span className="text-gray-500">(0)</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Failed <span className="text-gray-500">(0)</span>
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, customers, or products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Payment Status Filter */}
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Payment status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Cancelled</option>
                <option>Failed</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Fulfillment Status Filter */}
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Fulfilment status</option>
                <option>Fulfilled</option>
                <option>Partial</option>
                <option>Ready to pickup</option>
                <option>Cancelled</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* More Filters */}
            <button className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              More filters
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentArrowDownIcon className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-800">
                <strong>Error:</strong> {error}
              </div>
              <button
                onClick={fetchOrders}
                className="ml-4 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-2">No orders found</div>
                <div className="text-sm text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Orders will appear here when customers place them'}
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={orders.length > 0 && selectedOrders.length === orders.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>ORDER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>TOTAL</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>CUSTOMER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>PRODUCT</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>QUANTITY</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>PAYMENT STATUS</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>DATE</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="w-8 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order, index) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-xs text-blue-600 hover:underline cursor-pointer font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                        {order.total}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 w-8 h-8">
                            <div className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                              {getInitials(order.customer.name)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {order.customer.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {order.customer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs text-gray-900 font-medium truncate">
                          {order.product?.name || 'Unknown Product'}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {order.quantity}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus.color}`}>
                          {order.paymentStatus.text}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {order.date}
                      </td>
                      <td className="px-3 py-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm mt-4">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalOrders)} of {totalOrders} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    {totalPages > 6 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;