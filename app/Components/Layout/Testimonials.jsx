"use client";

import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaStar, FaUserCircle } from "react-icons/fa";
import { font } from '../Font/font';

const testimonials = Array(4).fill({
  name: 'John Doe',
  review: 'Was good. This the second laptop I have....',
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
});

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 4 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1 }
};

const Testimonials = () => {
  return (
    <div className={`${font.className} w-full px-12 py-6 mt-8`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-3xl">What Customers Have To Say</h2>
        <button className="border border-gray-300 rounded-full px-4 py-1 text-xs hover:bg-gray-100">See All</button>
      </div>
      
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={4000} arrows={false}>
        {testimonials.map((item, idx) => (
          <div key={idx} className="px-3">
            <div className="flex flex-col items-center">
              {/* Avatar above card */}
              <div className="-mb-8 z-10">
                <FaUserCircle className="text-[80px] text-gray-300 bg-white rounded-full p-2 border-4 border-white shadow" />
              </div>
              <div className="bg-purple-100 rounded-xl pt-12 pb-6 px-6 min-w-[270px] max-w-[300px] w-[270px] h-[320px] flex flex-col items-start shadow-md">
                <div className="font-bold text-lg mb-1">{item.name}</div>
                <div className="flex items-center mb-2">
                  {Array(6).fill(0).map((_, i) => (
                    <FaStar key={i} className="text-green-500 mr-1" />
                  ))}
                </div>
                <div className="text-md mb-2">{item.review}</div>
                <div className="text-lg text-gray-700 leading-snug">{item.description}</div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Testimonials;