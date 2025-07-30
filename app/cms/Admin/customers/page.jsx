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

const CustomersPage = () => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Load customers from API
  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm]);

  const fetchCustomers = async () => {
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
      
      const response = await fetch(`http://localhost:5000/api/cms/customers?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.data.customers);
        setTotalPages(data.data.pagination.totalPages);
        setTotalCustomers(data.data.pagination.totalItems);
      } else {
        setError(data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchCustomers();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Static dummy data for fallback
  const dummyCustomers = [
    {
      id: 1,
      avatar: "/api/placeholder/32/32",
      name: "Carry Anna",
      email: "annac34@gmail.com",
      orders: 89,
      totalSpent: "$23,987",
      city: "Budapest",
      lastSeen: "34 min ago",
      lastOrder: "Dec 12, 12:56 PM"
    },
    {
      id: 2,
      avatar: "/api/placeholder/32/32",
      name: "Mitind Mikuja",
      email: "mimiku@yahoo.com",
      orders: 76,
      totalSpent: "$21,567",
      city: "Manchester",
      lastSeen: "6 hours ago",
      lastOrder: "Dec 9, 2:28 PM"
    },
    {
      id: 3,
      avatar: "/api/placeholder/32/32",
      name: "Stanly Drinkwater",
      email: "stnlwasser@hotmail.com",
      orders: 69,
      totalSpent: "$19,872",
      city: "Smallville",
      lastSeen: "43 min ago",
      lastOrder: "Dec 4, 12:56 PM"
    },
    {
      id: 4,
      avatar: "/api/placeholder/32/32",
      name: "Josef Stravinsky",
      email: "Josefsky@sni.it",
      orders: 67,
      totalSpent: "$17,996",
      city: "Metropolis",
      lastSeen: "2 hours ago",
      lastOrder: "Dec 1, 4:07 AM"
    },
    {
      id: 5,
      avatar: "/api/placeholder/32/32",
      name: "Igor Borvibson",
      email: "vibigorr@technext.it",
      orders: 61,
      totalSpent: "$16,785",
      city: "Central city",
      lastSeen: "5 days ago",
      lastOrder: "Nov 28, 7:28 PM"
    }
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Customers</h1>

        {/* Status Tabs */}
        <div className="flex items-center space-x-6 mb-6">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2 font-medium">
            All <span className="text-gray-500">({totalCustomers})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            With Cards <span className="text-gray-500">({customers.filter(c => c.hasCard).length})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Without Cards <span className="text-gray-500">({customers.filter(c => !c.hasCard).length})</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 pb-2">
            Recent Orders <span className="text-gray-500">({customers.filter(c => c.orders > 0).length})</span>
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
                placeholder="Search customers by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            {/* Country Filter */}
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Country</option>
                <option>Hungary</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Italy</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* VIP Filter */}
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>VIP</option>
                <option>VIP Customer</option>
                <option>Regular Customer</option>
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
              <span>Add </span>
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
                onClick={fetchCustomers}
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
              <span className="ml-3 text-gray-600">Loading customers...</span>
            </div>
          </div>
        )}

        {/* Customers Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {customers.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 mb-2">No customers found</div>
                <div className="text-sm text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Customers will appear here when they register'}
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-8 px-3 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={customers.length > 0 && selectedCustomers.length === customers.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>CUSTOMER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>EMAIL</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>ORDERS</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>TOTAL SPENT</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>HAS CARD</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <span>LAST ORDER</span>
                        <ArrowsUpDownIcon className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="w-8 px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer, index) => (
                    <tr key={customer.id || `customer-${index}`} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={(e) => handleSelectCustomer(customer.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0 w-8 h-8">
                            <div className={`w-8 h-8 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                              {getInitials(customer.name)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {customer.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-blue-600 hover:underline cursor-pointer">
                        {customer.email}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                        {customer.orders}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 font-medium">
                        {customer.totalSpent}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          customer.hasCard 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.hasCard ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {customer.lastOrderDate}
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
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCustomers)} of {totalCustomers} results
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
                      key={`page-${pageNum}`}
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
                    {totalPages > 6 && <span key="ellipsis" className="px-2 text-gray-400">...</span>}
                    <button
                      key={`page-last-${totalPages}`}
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

export default CustomersPage;