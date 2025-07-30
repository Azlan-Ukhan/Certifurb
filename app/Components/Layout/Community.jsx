"use client";

import React from 'react';
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { font } from '../Font/font';

const videoData = Array(4).fill({ image: '/clock.jpg' });

const Community = () => {
  return (
    <div className={`${font.className} bg-gray-50 w-full px-4 md:px-8 lg:px-12 py-4 md:py-6 mt-8 md:mt-12`}>
      {/* Header */}
      <h2 className="font-bold text-xl md:text-2xl lg:text-3xl mb-4 md:mb-6 text-center sm:text-left">Certifurb Community</h2>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-stretch">
        {/* Banner */}
        <div className="rounded-xl hidden md:block w-full lg:min-w-[260px] lg:max-w-[300px] h-48 md:h-56 lg:h-auto flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 p-6 md:p-8 order-1 lg:order-1">
          <span className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-tight text-center lg:text-left">
            Join the<br />Certifurb<br />Community
          </span>
        </div>
        
        {/* Video Cards */}
        <div className="flex-1 flex items-center order-2 lg:order-2">
          <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide items-center w-full">
            {/* Left Arrow */}
            <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-black hover:bg-gray-100 z-10 flex-shrink-0">
              <FaChevronLeft className="text-sm md:text-base" />
            </button>
            
            {/* Video Cards */}
            {videoData.map((item, idx) => (
              <div 
                key={idx} 
                className="relative rounded-xl overflow-hidden min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[180px] md:max-w-[200px] lg:max-w-[220px] h-48 md:h-60 lg:h-72 bg-gray-200 flex items-center justify-center flex-shrink-0"
              >
                <img 
                  src={item.image} 
                  alt="Community Video" 
                  className="w-full h-full object-cover opacity-70" 
                />
                <button className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white bg-opacity-80 rounded-full p-3 md:p-4 shadow-lg">
                    <FaPlay className="text-xl md:text-2xl lg:text-3xl text-gray-700" />
                  </span>
                </button>
              </div>
            ))}
            
            {/* Right Arrow */}
            <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border border-black hover:bg-gray-100 z-10 flex-shrink-0">
              <FaChevronRight className="text-sm md:text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;