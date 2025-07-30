"use client";

import React from 'react';
import { FaRegHeart } from "react-icons/fa";
import { font } from '../Font/font';
import { formatPrice } from '../../utils/priceFormatter';

const samsungData = [
  {
    id: 1,
    name: 'Dell Latitude 740e',
    price: formatPrice(250000),
    discount: '45% vs. new',
    image: '/laptop.png',
  },
  {
    id: 2,
    name: 'Dell Latitude 740e',
    price: formatPrice(250000),
    discount: '45% vs. new',
    image: '/laptop.png',
  },
  {
    id: 3,
    name: 'Dell Latitude 740e',
    price: formatPrice(250000),
    discount: '45% vs. new',
    image: '/laptop.png',
  },
];

const Samsung = () => {
  return (
    <div className={`${font.className} px-4 md:px-8 lg:px-12 mb-8 md:mb-12 w-full flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 pt-4 mb-4 md:mb-8">
        <h2 className="font-bold text-xl md:text-2xl lg:text-3xl text-center sm:text-left">Certifurb Renewed Laptops</h2>
        <button className="border border-gray-500 rounded-full px-3 py-1 text-sm hover:bg-gray-100 self-center sm:self-auto sm:mr-3">See All</button>
      </div>
      
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-4">
        {/* Cards Section */}
        <div className="flex-1 flex items-center order-1 lg:order-1">
          <div className="flex gap-3 md:gap-4 lg:gap-4 overflow-x-auto scrollbar-hide w-full">
            {samsungData.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow pt-4 md:pt-6 pr-4 md:pr-6 pb-4 pl-2 md:pl-3 border border-gray-400 border-2 relative min-w-[180px] md:min-w-[200px] max-w-[200px] md:max-w-[220px] flex-shrink-0"
              >
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs md:text-sm font-medium mt-1 md:mt-2 ml-1 md:ml-2 py-1 px-2 md:px-3 rounded-full">
                  {item.discount}
                </span>
                
                {/* Wishlist button */}
                <div className="absolute top-2 right-2 mt-2 md:mt-3 mr-1 md:mr-0 text-black hover:text-gray-600 text-sm md:text-base">
                  <FaRegHeart />
                </div>
                
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 md:h-40 my-2 md:my-4 object-contain px-2"
                />
                
                {/* Content Container */}
                <div className="w-full pl-0">
                  {/* Product Name */}
                  <h3 className="text-sm md:text-md font-bold text-gray-800 leading-tight text-left">
                    {item.name}
                  </h3>
                  
                  {/* Price */}
                  <p className="text-md font-semibold text-black mt-2 text-left">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Right Arrow */}
            <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 ml-2 self-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Banner Section */}
        <div className="relative w-full lg:w-1/2 lg:min-w-[320px] h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden flex items-center justify-center order-2 lg:order-2">
          <img src="/laptop.png" alt="Samsung Banner" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          {/* Green overlay */}
          <div className="absolute inset-0 bg-green-400 opacity-70" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-800 via-green-400/70 to-transparent opacity-10" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6">
            <span className="text-white text-xl md:text-2xl lg:text-3xl font-bold text-center drop-shadow mb-2">
              Powerful Performance<br />At Better Prices
            </span>
            <span className="mt-4 font-bold text-lg md:text-xl lg:text-2xl text-white bg-black/60 px-4 py-2 rounded-lg tracking-wider">
              Dell Laptops
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Samsung;