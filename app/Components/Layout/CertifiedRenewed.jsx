"use client";

import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { font } from '../Font/font';
import Link from 'next/link';

const products = [
  { id: 1, name: 'Laptops', image: '/laptop.png', href:"/category?filter=Laptop" },
  { id: 2, name: 'Desktop PC', image: '/pc-1.jpg', href:"/category?filter=Desktop PC" },
  { id: 3, name: 'Mouse', image: '/mouse-1.jpg', href:"/category?filter=Mouse" },
  { id: 4, name: 'Keyboard', image: '/keyboard-1.png', href:"/category?filter=Keyboard" },
  { id: 5, name: 'Monitors', image: '/monitor-1.png', href:"/category?filter=Monitors" },
  { id: 6, name: 'Drive', image: '/drive-1.jpg', href:"/category?filter=Drive" },
  { id: 7, name: 'Network', image: '/network-router.png', href:"/category?filter=Network" },
  { id: 9, name: 'Printer', image: '/printer-1.png', href:"/category?filter=Printer" },
  { id: 10, name: 'Tablet', image: '/ipad-1.jpg', href:"/category?filter=Tablet" }
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 6 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 2 }
};

const CertifiedRenewed = () => {
  return (
    <div className={`${font.className} px-12 pt-12`}>
      <div className="mb-6">
        <h1 className="font-extrabold text-3xl">Shop Certified Renewed</h1>
      </div>

      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000} partialVisible={true} arrows={false}>
        {products.map((product) => (
            <div key={product.id} className="p-1 sm:p-3">
              <Link href={product.href}>
                <div className="bg-gray-100 rounded-md shadow-md flex flex-col justify-center items-center h-44 overflow-hidden">
                    <img
                    src={product.image}
                    alt={product.name}
                    className=" w-28 h-22"
                    />
                    <p className="mt-2 font-bold text-center">{product.name}</p>
                </div>
            </Link>
            </div>
        ))}
        </Carousel>
    </div>
  );
};

export default CertifiedRenewed;
