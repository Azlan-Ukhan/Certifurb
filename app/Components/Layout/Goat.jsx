"use client";

import React, { useState, useEffect } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { font } from '../Font/font';
import { font2 } from '../Font/font';
import Link from 'next/link';
import { formatPrice } from '../../utils/priceFormatter';

const Goat = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [goatProducts, setGoatProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch GOAT products from database
  useEffect(() => {
    const fetchGoatProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        const result = await response.json();
        
        if (result.success) {
          // Filter only GOAT Product category
          const goatProductsData = result.data.filter(product => 
            product.ProductCategory === 'GOAT Product'
          );
          setGoatProducts(goatProductsData);
        } else {
          setError(result.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching GOAT products:', error);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchGoatProducts();
  }, []);

  // Calculate discount percentage
  const calculateDiscount = (price) => {
    const originalPrice = price * 1.45; // Assuming 45% discount
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= goatProducts.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? goatProducts.length - 1 : prevIndex - 1
    );
  };

  // Get visible products based on screen size
  const getVisibleProducts = () => {
    const visibleCount = 3; // Show 3 products at a time
    const products = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % goatProducts.length;
      products.push({ ...goatProducts[index], displayIndex: index });
    }
    
    return products;
  };

  return (
    <div className={`${font.className} px-4 md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4 md:mt-4 mb-2 ">
        <h1 className="font-extrabold  text-xl md:text-2xl lg:text-3xl text-center sm:text-left">Shop <span className={`${font2.className} text-blue-800 font-bold`}>G.O.A.T</span> Products</h1>
        <Link href="/category?filter=GOAT%20Product">
          <button className="border border-gray-500 rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
        </Link>
      </div>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
        {/* Banner Section */}
        <div className="relative w-full lg:w-1/2 lg:min-w-[320px] h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden flex items-center justify-center order-1 lg:order-1">
          <img src="/banner-goat.png" alt="GOAT Banner" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-black opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-10" />
          <div className="relative z-10 flex flex-col items-start justify-center h-full w-full px-6 md:px-8">
            <span className="text-white text-xl md:text-3xl lg:text-4xl font-bold drop-shadow mb-2">
              Eco-Friendly Tech.<br />Sustainable.
            </span>
            <span className="mt-4 md:mt-8 font-bold text-lg md:text-xl lg:text-2xl text-white bg-green-500 px-6 md:px-8 py-2 rounded-lg tracking-wider shadow-lg">
              Accessories
            </span>
          </div>
        </div>
        
        {/* Cards Section */}
        <div className="flex-1 flex items-center order-2 lg:order-2">
          {loading ? (
            <div className="flex items-center justify-center w-full h-40">
              <div className="text-gray-500">Loading GOAT products...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center w-full h-40">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : goatProducts.length === 0 ? (
            <div className="flex items-center justify-center w-full h-40">
              <div className="text-gray-500">No GOAT products found</div>
            </div>
          ) : (
            <div className="flex items-center w-full">
              {/* Left Arrow */}
              <button 
                onClick={prevSlide}
                className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 mr-2 flex-shrink-0 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-3 md:gap-4 lg:gap-4 overflow-hidden w-full">
                {/* Display GOAT products from database in carousel */}
                {getVisibleProducts().map((product, index) => (
                  <Link key={`${product.ProductID}-${currentIndex}-${index}`} href={`/product/${product.ProductID}`}>
                    <div className="bg-white rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[180px] md:min-w-[200px] max-w-[200px] md:max-w-[220px] flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer">
                      {/* Discount Badge */}
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs md:text-sm font-medium mt-1 md:mt-2 ml-1 md:ml-2 py-1 px-2 md:px-3 rounded-full">
                        {calculateDiscount(product.ProductPrice)}% vs. new
                      </span>
                      
                      {/* Wishlist button */}
                      <div className="absolute top-2 right-2 mt-2 md:mt-3 mr-1 md:mr-0 text-black hover:text-gray-600 text-sm md:text-base">
                        <FaRegHeart />
                      </div>
                      
                      {/* Product Image */}
                      <img
                        src={product.ProductImageURL || `/goat-${(product.displayIndex % 5) + 1}.png`}
                        alt={product.ProductName}
                        className="w-full h-32 md:h-40 my-2 md:my-4 object-contain px-2"
                      />
                      
                      {/* Content Container */}
                      <div className="w-full pl-0">
                        {/* Product Name */}
                        <h3 className="text-sm md:text-md font-bold text-black leading-tight text-left">
                          {product.ProductName}
                        </h3>
                        
                        {/* Specs */}
                        <div className="text-xs md:text-sm text-gray-500 mb-2 text-left">
                          {product.ProductDesc}
                        </div>
                        
                        {/* Price */}
                        <p className="text-md font-semibold text-black mt-2 text-left">
  {formatPrice(product.ProductPrice)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Right Arrow */}
              <button 
                onClick={nextSlide}
                className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 ml-2 flex-shrink-0 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goat;
