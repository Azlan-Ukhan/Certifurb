"use client";

import React, { useState, useEffect } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { font } from '../Font/font';
import Link from 'next/link';
import { formatPrice } from '../../utils/priceFormatter';

const Iphone = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch laptop data from database
  useEffect(() => {
    const fetchLaptops = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        if (data.success) {
          // Filter only laptop products and limit to 3
          const laptopProducts = data.data
            .filter(product => product.ProductCategory?.toLowerCase() === 'laptop')
            .slice(0, 3);
          setLaptops(laptopProducts);
        } else {
          setError(data.message || 'Failed to fetch laptops');
        }
      } catch (error) {
        console.error('Error fetching laptops:', error);
        setError('Failed to load laptops');
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  // Calculate discount percentage
  const calculateDiscount = (price) => {
    const originalPrice = price * 1.45; // Assuming 45% discount
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className={`${font.className} px-4 md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4 mb-4 md:mb-8">
        <h2 className="font-bold text-xl md:text-2xl lg:text-3xl text-center sm:text-left">Certifurb Renewed Laptops</h2>
        <Link href="/category?filter=Laptop">
          <button className="border border-gray-500 rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
        </Link>
      </div>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
        {/* Left Banner */}
        <div className="relative w-full lg:w-1/2 lg:min-w-[320px] h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden flex items-center justify-center">
          <img src="/macs-group.png" alt="Laptops" className="absolute inset-0 w-full h-full object-contain opacity-60" />
          {/* Green overlay */}
          <div className="absolute inset-0 bg-green-500 opacity-70" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-800 via-green-500/70 to-transparent opacity-10" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
            <span className="text-white text-xl md:text-2xl lg:text-3xl font-bold text-center">
              Upto 70% Off<br />On Laptops
            </span>
          </div>
        </div>
        
        {/* Right Cards */}
        <div className="flex-1 flex items-center">
          <div className="flex gap-3 md:gap-4 lg:gap-4 overflow-x-auto scrollbar-hide w-full">
            {loading ? (
              // Loading state
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[180px] md:min-w-[200px] max-w-[200px] md:max-w-[220px] flex-shrink-0 animate-pulse"
                >
                  <div className="w-full h-32 md:h-40 my-2 md:my-4 bg-gray-300 rounded"></div>
                  <div className="w-full pl-0">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="flex items-center justify-center w-full h-32 text-red-500">
                <p>Error loading laptops: {error}</p>
              </div>
            ) : laptops.length === 0 ? (
              // No laptops found
              <div className="flex items-center justify-center w-full h-32 text-gray-500">
                <p>No laptops available</p>
              </div>
            ) : (
              // Display laptops
              laptops.map((laptop) => (
                <Link key={laptop.ProductID} href={`/product/${laptop.ProductID}`}>
                  <div className="bg-white rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[180px] md:min-w-[200px] max-w-[200px] md:max-w-[220px] flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer">
                    {/* Discount Badge */}
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs md:text-sm font-medium mt-1 md:mt-2 ml-1 md:ml-2 py-1 px-2 md:px-3 rounded-full">
                      {calculateDiscount(laptop.ProductPrice)}% vs. new
                    </span>
                    
                    {/* Wishlist button */}
                    <div className="absolute top-2 right-2 mt-2 md:mt-3 mr-1 md:mr-0 text-black hover:text-gray-600 text-sm md:text-base">
                      <FaRegHeart />
                    </div>
                    
                    {/* Product Image */}
                    <img
                      src={laptop.ProductImageURL || '/laptop.png'}
                      alt={laptop.ProductName}
                      className="w-full h-32 md:h-40 my-2 md:my-4 object-contain px-2"
                    />
                    
                    {/* Content Container */}
                    <div className="w-full pl-0">
                      {/* Product Name */}
                      <h3 className="text-sm md:text-md font-bold text-gray-800 leading-tight text-left">
                        {laptop.ProductName}
                      </h3>
                      
                      {/* Price */}
                      <p className="text-md font-semibold text-black mt-2 text-left">
{formatPrice(laptop.ProductPrice)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
            
            {/* Right Arrow */}
            <Link href="/category?filter=Laptop">
              <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 ml-2 self-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iphone;