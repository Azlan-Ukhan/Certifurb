'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../Components/Layout/Layout';
import { Geist } from "next/font/google";
import {
  ShoppingBagIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const font = Geist({
  subsets: ["latin"],
});

// Chart.js components (will work when Chart.js is installed)
const LineChart = ({ data, options, height = 300 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      // Import Chart.js dynamically to avoid SSR issues
      import('chart.js/auto').then((Chart) => {
        const ctx = canvasRef.current.getContext('2d');
        
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart.default(ctx, {
          type: 'line',
          data: data,
          options: {
            ...options,
            responsive: true,
            maintainAspectRatio: false,
          }
        });
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} height={height} />;
};

const BarChart = ({ data, options, height = 100 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      import('chart.js/auto').then((Chart) => {
        const ctx = canvasRef.current.getContext('2d');
        
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart.default(ctx, {
          type: 'bar',
          data: data,
          options: {
            ...options,
            responsive: true,
            maintainAspectRatio: false,
          }
        });
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} height={height} />;
};

const DoughnutChart = ({ data, options, height = 200 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      import('chart.js/auto').then((Chart) => {
        const ctx = canvasRef.current.getContext('2d');
        
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart.default(ctx, {
          type: 'doughnut',
          data: data,
          options: {
            ...options,
            responsive: true,
            maintainAspectRatio: false,
          }
        });
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} height={height} />;
};

const CmsDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    totalOrders: 16247,
    newCustomers: 356,
    ordersChange: -6.8,
    customersChange: 26.5,
    newOrders: 57,
    ordersOnHold: 5,
    outOfStock: 15
  });
  const router = useRouter();

  // Generate random data for real-time updates
  const generateRandomData = () => {
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 5000) + 1000,
        customers: Math.floor(Math.random() * 100) + 20,
        orders: Math.floor(Math.random() * 200) + 50
      };
    });
    return last30Days;
  };

  const [chartData, setChartData] = useState(() => generateRandomData());

  useEffect(() => {
    // Check if user is logged in and is admin
    const cmsUser = localStorage.getItem('cmsUser');
    if (!cmsUser) {
      router.push('/cms');
      return;
    }

    const userData = JSON.parse(cmsUser);
    // Allow admin, marketer, and sales roles to access dashboard
    if (!userData.role || (userData.role !== 'admin' && userData.role !== 'marketer' && userData.role !== 'sales')) {
      router.push('/cms');
      return;
    }

    setAdminUser(userData);
    fetchDashboardData();

    // Update real-time data every 5 seconds
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 10),
        newCustomers: prev.newCustomers + Math.floor(Math.random() * 3),
        newOrders: Math.floor(Math.random() * 20) + 40,
        ordersOnHold: Math.floor(Math.random() * 10) + 2,
        outOfStock: Math.floor(Math.random() * 25) + 10,
      }));
      
      // Update chart data less frequently
      if (Math.random() > 0.7) {
        setChartData(generateRandomData());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users
      const usersResponse = await fetch('http://localhost:5000/api/cms/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.data || []);
      }

      // Fetch products
      const productsResponse = await fetch('http://localhost:5000/api/products');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart configurations
  const salesLineChartData = {
    labels: chartData.map(d => d.date),
    datasets: [
      {
        label: 'Sales',
        data: chartData.map(d => d.sales),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Projected',
        data: chartData.map(d => d.sales * 0.8),
        borderColor: '#93C5FD',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      }
    ]
  };

  const salesLineChartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#F3F4F6'
        }
      },
      y: {
        display: true,
        grid: {
          color: '#F3F4F6'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const miniBarChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [20, 35, 45, 30, 55, 40, 60],
      backgroundColor: '#3B82F6',
      borderRadius: 2,
    }]
  };

  const miniBarChartOptions = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    },
    elements: {
      bar: {
        borderRadius: 2
      }
    }
  };

  const paymentStatusData = {
    labels: ['Completed', 'Pending Payment'],
    datasets: [{
      data: [52, 48],
      backgroundColor: ['#3B82F6', '#E5E7EB'],
      borderWidth: 0,
    }]
  };

  const paymentStatusOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    },
    cutout: '70%',
  };

  const couponsData = {
    labels: ['Percentage Discount', 'Fixed Cart Discount', 'Fixed Product Discount'],
    datasets: [{
      data: [72, 18, 10],
      backgroundColor: ['#3B82F6', '#EAB308', '#10B981'],
      borderWidth: 0,
    }]
  };

  const couponsOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    },
    cutout: '60%',
  };

  const customerTypeData = {
    labels: ['Paying Customers', 'Non-paying Customers'],
    datasets: [{
      data: [30, 70],
      backgroundColor: ['#3B82F6', '#E5E7EB'],
      borderWidth: 0,
    }]
  };

  const customerTypeOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    },
    cutout: '70%',
  };

  if (isLoading) {
    return (
      <div className={`${font.className} min-h-screen bg-gray-100 flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ecommerce Dashboard</h1>
          <p className="text-gray-600">Here's what's going on at your business right now</p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-600">Total orders</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    realTimeData.ordersChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {realTimeData.ordersChange >= 0 ? '+' : ''}{realTimeData.ordersChange}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">Last 7 days</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {realTimeData.totalOrders.toLocaleString()}
                </h3>
              </div>
              <div className="h-16 w-20">
                <BarChart data={miniBarChartData} options={miniBarChartOptions} height={64} />
              </div>
            </div>
          </div>

          {/* New Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-600">New customers</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    realTimeData.customersChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {realTimeData.customersChange >= 0 ? '+' : ''}{realTimeData.customersChange}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">Last 7 days</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {realTimeData.newCustomers.toLocaleString()}
                </h3>
              </div>
              <div className="text-right">
                <div className="h-16 w-24">
                  <LineChart 
                    data={{
                      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                      datasets: [{
                        data: [40, 35, 30, 20, 15, 10, 5],
                        borderColor: '#3B82F6',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0,
                      }]
                    }}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: { x: { display: false }, y: { display: false } }
                    }}
                    height={64}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>01 May</span>
                  <span>07 May</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* New Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <ShoppingBagIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{realTimeData.newOrders}</h4>
                <p className="text-sm font-medium text-gray-900">new orders</p>
                <p className="text-xs text-gray-500">Awaiting processing</p>
              </div>
            </div>
          </div>

          {/* Orders On Hold */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-4">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{realTimeData.ordersOnHold}</h4>
                <p className="text-sm font-medium text-gray-900">orders</p>
                <p className="text-xs text-gray-500">On hold</p>
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-900">{realTimeData.outOfStock}</h4>
                <p className="text-sm font-medium text-gray-900">products</p>
                <p className="text-xs text-gray-500">Out of stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Total Sells Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total sells</h3>
                <p className="text-sm text-gray-600">Payment received across all channels</p>
              </div>
              <div className="relative">
                <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
                  Mar 1 - 31, 2023
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="h-64">
              <LineChart data={salesLineChartData} options={salesLineChartOptions} height={256} />
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
            </div>
            
            <div className="h-48 flex items-center justify-center mb-4">
              <DoughnutChart data={paymentStatusData} options={paymentStatusOptions} height={192} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="text-sm font-medium">52%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pending payment</span>
                </div>
                <span className="text-sm font-medium">48%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Coupons */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top coupons</h3>
              <p className="text-sm text-gray-600">Last 7 days</p>
            </div>
            
            <div className="h-48 flex items-center justify-center mb-4">
              <DoughnutChart data={couponsData} options={couponsOptions} height={192} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Percentage discount</span>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Fixed cart discount</span>
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Fixed product discount</span>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>

          {/* Paying vs Non Paying */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Paying vs non paying</h3>
              <p className="text-sm text-gray-600">Last 7 days</p>
            </div>
            
            <div className="h-48 flex items-center justify-center mb-4">
              <DoughnutChart data={customerTypeData} options={customerTypeOptions} height={192} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Paying customer</span>
                </div>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Non-paying customer</span>
                </div>
                <span className="text-sm font-medium">70%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Demo Button */}
        <div className="fixed bottom-6 right-6">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Chat demo</span>
            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </button>
        </div>

        {/* Latest Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          {/* Reviews Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Latest reviews</h3>
              <p className="text-sm text-gray-600">Payment received across all channels</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <svg className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All products</option>
                <option>Electronics</option>
                <option>Accessories</option>
              </select>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Reviews Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 w-8">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PRODUCT ↕
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CUSTOMER ↕
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RATING ↕
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    REVIEW ↕
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Fitbit Review */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12a3 3 0 100-6 3 3 0 000 6z" />
                          <path fillRule="evenodd" d="M9 2a7 7 0 100 14 7 7 0 000-14zM3 9a6 6 0 1112 0 6 6 0 01-12 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        Fitbit Sense Advanced Smartwatch with Tools fo...
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-medium">R</span>
                      </div>
                      <span className="text-sm text-gray-900">Richard Dawkins</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <p className="text-sm text-gray-900">
                      This Fitbit is fantastic! I was trying to be in better shape and needed some motivation, so I decided to treat myself to a new Fitbit.
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  </td>
                </tr>

                {/* iPhone Review */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 1v10h12V5H4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        iPhone 13 pro max- Pacific Blue-128GB storage
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" 
                          alt="Ashley Garrett" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-900">Ashley Garrett</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {[...Array(3)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      {[...Array(2)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <p className="text-sm text-gray-900">
                      The order was delivered ahead of schedule. To give us additional time, you should leave the packaging sealed with plastic.
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>

                {/* MacBook Review */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v6h10V5H5z" clipRule="evenodd" />
                          <path d="M8 13h4v1H8v-1z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        Apple MacBook Pro 13 inch- M1-8/256GB- space
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                          alt="Woodrow Burton" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-900">Woodrow Burton</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <svg className="h-4 w-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                        <defs>
                          <linearGradient id="half-star">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="#D1D5DB" />
                          </linearGradient>
                        </defs>
                        <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <p className="text-sm text-gray-900">
                      It's a Mac, after all. Once you've gone Mac, there's no going back. My first Mac lasted over nine years, and this is my second.
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  </td>
                </tr>

                {/* iMac Review */}
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v6h10V5H5z" clipRule="evenodd" />
                          <path d="M9 14h2v1H9v-1z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        Apple iMac 24" 4K Retina Display M1 8 Core CPU...
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-900">Eric McGee</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {[...Array(3)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-orange-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      {[...Array(2)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <p className="text-sm text-gray-900">
                      Personally, I like the minimalist style, but I wouldn't choose it if I were searching for a computer that I would use frequently. It's...
                      <span className="text-blue-600 hover:underline cursor-pointer ml-1">See more</span>
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Regions by Revenue Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          {/* Section Header */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top regions by revenue</h3>
            <p className="text-sm text-gray-600">Where you generated most of the revenue</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Data Table */}
            <div>
              {/* Table Headers */}
              <div className="grid grid-cols-5 gap-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>COUNTRY ↕</div>
                <div className="text-right">USERS ↕</div>
                <div className="text-right">TRANSACTIONS ↕</div>
                <div className="text-right">REVENUE ↕</div>
                <div className="text-right">CONV. RATE ↕</div>
              </div>

              {/* Total Summary Row */}
              <div className="grid grid-cols-5 gap-6 py-4 font-bold text-gray-900 border-b border-gray-100">
                <div></div>
                <div className="text-right">377,620</div>
                <div className="text-right">236</div>
                <div className="text-right">$15,758</div>
                <div className="text-right">10.32%</div>
              </div>

              {/* Country Data Rows */}
              <div className="space-y-1">
                {/* India */}
                <div className="grid grid-cols-5 gap-6 py-3 text-sm hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-500 font-medium">1.</span>
                    <img 
                      src="https://flagcdn.com/w20/in.png" 
                      alt="India flag" 
                      className="w-5 h-3 mr-3 rounded-sm object-cover"
                    />
                    <span className="text-gray-900 font-medium">India</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">92896</span>
                    <span className="text-gray-500 ml-1 text-xs">(41.6%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">67</span>
                    <span className="text-gray-500 ml-1 text-xs">(34.3%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">$7560</span>
                    <span className="text-gray-500 ml-1 text-xs">(36.9%)</span>
                  </div>
                  <div className="text-right font-semibold text-gray-900">14.01%</div>
                </div>

                {/* China */}
                <div className="grid grid-cols-5 gap-6 py-3 text-sm hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-500 font-medium">2.</span>
                    <img 
                      src="https://flagcdn.com/w20/cn.png" 
                      alt="China flag" 
                      className="w-5 h-3 mr-3 rounded-sm object-cover"
                    />
                    <span className="text-gray-900 font-medium">China</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">50496</span>
                    <span className="text-gray-500 ml-1 text-xs">(32.8%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">54</span>
                    <span className="text-gray-500 ml-1 text-xs">(23.8%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">$6532</span>
                    <span className="text-gray-500 ml-1 text-xs">(26.5%)</span>
                  </div>
                  <div className="text-right font-semibold text-gray-900">23.56%</div>
                </div>

                {/* USA */}
                <div className="grid grid-cols-5 gap-6 py-3 text-sm hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-500 font-medium">3.</span>
                    <img 
                      src="https://flagcdn.com/w20/us.png" 
                      alt="USA flag" 
                      className="w-5 h-3 mr-3 rounded-sm object-cover"
                    />
                    <span className="text-gray-900 font-medium">USA</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">45679</span>
                    <span className="text-gray-500 ml-1 text-xs">(24.3%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">35</span>
                    <span className="text-gray-500 ml-1 text-xs">(19.7%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">$5432</span>
                    <span className="text-gray-500 ml-1 text-xs">(16.9%)</span>
                  </div>
                  <div className="text-right font-semibold text-gray-900">10.23%</div>
                </div>

                {/* South Korea */}
                <div className="grid grid-cols-5 gap-6 py-3 text-sm hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-500 font-medium">4.</span>
                    <img 
                      src="https://flagcdn.com/w20/kr.png" 
                      alt="South Korea flag" 
                      className="w-5 h-3 mr-3 rounded-sm object-cover"
                    />
                    <span className="text-gray-900 font-medium">South Korea</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">36453</span>
                    <span className="text-gray-500 ml-1 text-xs">(19.7%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">22</span>
                    <span className="text-gray-500 ml-1 text-xs">(9.54%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">$4673</span>
                    <span className="text-gray-500 ml-1 text-xs">(11.6%)</span>
                  </div>
                  <div className="text-right font-semibold text-gray-900">8.85%</div>
                </div>

                {/* Vietnam */}
                <div className="grid grid-cols-5 gap-6 py-3 text-sm hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-500 font-medium">5.</span>
                    <img 
                      src="https://flagcdn.com/w20/vn.png" 
                      alt="Vietnam flag" 
                      className="w-5 h-3 mr-3 rounded-sm object-cover"
                    />
                    <span className="text-gray-900 font-medium">Vietnam</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">15007</span>
                    <span className="text-gray-500 ml-1 text-xs">(11.9%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">17</span>
                    <span className="text-gray-500 ml-1 text-xs">(6.91%)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">$2456</span>
                    <span className="text-gray-500 ml-1 text-xs">(10.2%)</span>
                  </div>
                  <div className="text-right font-semibold text-gray-900">6.01%</div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">1 to 5 items of 10</span>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm text-gray-400 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50" disabled>
                    ← Previous
                  </button>
                  <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Interactive World Map */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96">
              {/* Map Container */}
              <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-gray-100">
                {/* Zoom Controls */}
                <div className="absolute top-4 left-4 z-10 flex flex-col bg-white rounded shadow-sm">
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-b">
                    <span className="text-lg font-light">+</span>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                    <span className="text-lg font-light">−</span>
                  </button>
                </div>

                {/* World Map SVG */}
                <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                  {/* Simplified world map outline */}
                  <g fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="0.5">
                    {/* North America */}
                    <path d="M 150 100 L 300 100 L 320 150 L 280 200 L 180 180 L 150 150 Z" />
                    {/* South America */}
                    <path d="M 250 250 L 300 250 L 320 350 L 280 400 L 260 380 L 240 300 Z" />
                    {/* Europe */}
                    <path d="M 450 80 L 550 80 L 570 120 L 520 140 L 450 120 Z" />
                    {/* Africa */}
                    <path d="M 480 150 L 580 150 L 600 300 L 520 320 L 480 250 Z" />
                    {/* Asia */}
                    <path d="M 600 60 L 800 60 L 850 180 L 750 200 L 600 150 Z" />
                    {/* Australia */}
                    <path d="M 750 300 L 850 300 L 860 350 L 780 360 L 750 340 Z" />
                  </g>

                  {/* Data Points */}
                  {/* Europe - Green circle with 111 */}
                  <g>
                    <circle cx="500" cy="110" r="20" fill="#10B981" />
                    <text x="500" y="116" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">111</text>
                  </g>

                  {/* Europe - Blue circle with 2 */}
                  <g>
                    <circle cx="550" cy="100" r="15" fill="#3B82F6" />
                    <text x="550" y="106" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">2</text>
                  </g>

                  {/* Africa - Orange circle with 10 */}
                  <g>
                    <circle cx="520" cy="220" r="18" fill="#F97316" />
                    <text x="520" y="226" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">10</text>
                  </g>

                  {/* South America - Blue circle with 8 */}
                  <g>
                    <circle cx="280" cy="320" r="16" fill="#3B82F6" />
                    <text x="280" y="326" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">8</text>
                  </g>

                  {/* Australia/Oceania - Blue circle with 2 */}
                  <g>
                    <circle cx="800" cy="330" r="14" fill="#3B82F6" />
                    <text x="800" y="336" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
                  </g>
                </svg>

                {/* Region Labels */}
                <div className="absolute top-20 right-20 text-xs text-gray-500 font-medium">EUROPE</div>
                <div className="absolute top-48 right-32 text-xs text-gray-500 font-medium">AFRICA</div>
                <div className="absolute bottom-32 right-16 text-xs text-gray-500 font-medium">AUSTRALIA</div>
                <div className="absolute bottom-32 right-48 text-xs text-gray-500 font-medium">OCEANIA</div>
              </div>

              {/* Chat Demo Button */}
              <div className="absolute bottom-4 right-4">
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors text-xs">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                  <span className="font-medium">Chat demo</span>
                  <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projection vs Actual & Returning Customer Rate Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Projection vs Actual Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Projection vs actual</h3>
              <p className="text-sm text-gray-600">Actual earnings vs projected earnings</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Projected revenue</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-sky-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Actual revenue</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64">
              <BarChart 
                data={{
                  labels: ['May 24', '', '', 'May 28', '', '', 'Jun 01'],
                  datasets: [
                    {
                      label: 'Projected revenue',
                      data: [38000, 28000, 30000, 48000, 30000, 25000, 29000],
                      backgroundColor: '#3B82F6',
                      borderRadius: 4,
                      maxBarThickness: 20,
                    },
                    {
                      label: 'Actual revenue',
                      data: [45000, null, 47000, null, 46000, 35000, 42000],
                      backgroundColor: '#7DD3FC',
                      borderRadius: 4,
                      maxBarThickness: 20,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#6B7280',
                        font: { size: 12 }
                      }
                    },
                    y: {
                      beginAtZero: true,
                      max: 50000,
                      grid: { color: '#F3F4F6' },
                      ticks: {
                        color: '#6B7280',
                        font: { size: 12 },
                        callback: function(value) {
                          return '$' + (value / 1000) + 'K';
                        }
                      }
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  }
                }}
                height={256}
              />
            </div>
          </div>

          {/* Returning Customer Rate Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Returning customer rate</h3>
              <p className="text-sm text-gray-600">Rate of customers returning to your shop over time</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-200 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Fourth time</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-sky-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Third time</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Second time</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-64">
              <LineChart 
                data={{
                  labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                  datasets: [
                    {
                      label: 'Fourth time',
                      data: [50, 35, 60, 20, 85, 30, 25, 20, 75, 95],
                      borderColor: '#BFDBFE',
                      backgroundColor: 'transparent',
                      borderWidth: 2,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 4,
                    },
                    {
                      label: 'Third time',
                      data: [40, 30, 50, 65, 80, 60, 40, 20, 30, 85],
                      borderColor: '#7DD3FC',
                      backgroundColor: 'transparent',
                      borderWidth: 2,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 4,
                    },
                    {
                      label: 'Second time',
                      data: [40, 75, 60, 75, 20, 55, 40, 55, 20, 75],
                      borderColor: '#2563EB',
                      backgroundColor: 'transparent',
                      borderWidth: 3,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 4,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: {
                        color: '#6B7280',
                        font: { size: 12 }
                      }
                    },
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: { color: '#F3F4F6' },
                      ticks: {
                        color: '#6B7280',
                        font: { size: 12 },
                        callback: function(value) {
                          return value + '%';
                        }
                      }
                    }
                  },
                  interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                  }
                }}
                height={256}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CmsDashboard; 