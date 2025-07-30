"use client";

import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { font } from '../Font/font';
import { FaRegHeart } from "react-icons/fa";
import Link from 'next/link';
import { formatPrice as formatPriceUtil } from '../../utils/priceFormatter';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 2,
    slidesToSlide: 1,
  },
};

const Promotion = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      
      if (data.success) {
        // Take first 8 products for promotion (increased from 6 to show all products)
        setProducts(data.data.slice(0, 10));
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return formatPriceUtil(price);
    }
    return price || 'Price not available';
  };

  if (loading) {
    return (
      <div className={`${font.className} px-12 mt-4 py-6 bg-white`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-black">
            Certifurb Promotion <span className="text-green-500"></span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${font.className} px-12 mt-4 py-6 bg-white`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-black">
          Certifurb Promotion <span className="text-green-500"></span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${font.className} px-12 mt-4 py-6 bg-white`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-black">
        Certifurb Promotion <span className="text-green-500"></span>
        </h2>
        <button className="text-sm text-gray-600 hover:cursor-pointer border border-gray-400 px-3 py-1 rounded-full mr-2">See All</button>
      </div>

      {/* Carousel */}
      {products.length > 0 ? (
        <Carousel
          responsive={responsive}
          swipeable={true}
          draggable={true}
          showDots={false}
          infinite={false}
          keyBoardControl={true}
          customTransition="transform 300ms ease-in-out"
          transitionDuration={300}
          containerClass="carousel-container"
          itemClass="px-2"
          arrows
        >
          {products.map((product, index) => (
            <Link
              key={product.ProductID || index}
              href={`/product/${product.ProductID}`}
              className="block"
            >
              <div className="bg-white rounded-xl shadow p-12 pb-4 px-2 border border-gray-400 border-2 relative cursor-pointer hover:shadow-lg transition-shadow">
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 custom-green-bg text-white text-sm font-medium mt-2 ml-2 py-1 px-3 rounded-full">
                  45% vs. new
                </span>

                {/* Wishlist button */}
                <div 
                  className="absolute top-2 right-2 mt-3 text-black hover:text-gray-600 cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Add wishlist functionality here
                    console.log('Added to wishlist:', product.ProductName);
                  }}
                >
                  <FaRegHeart/>
                </div>

                {/* Product Image */}
                <div className="w-full h-40 my-4 flex items-center justify-center bg-gray-50 rounded-lg">
                  {product.ProductImageURL ? (
                    <img
                      src={product.ProductImageURL}
                      alt={product.ProductName || 'Product'}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        // Fallback to default image if the URL fails to load
                        e.target.src = "/laptop.png";
                        e.target.onerror = null; // Prevent infinite loop
                      }}
                      onLoad={(e) => {
                        // Remove background when image loads successfully
                        e.target.parentElement.classList.remove('bg-gray-50');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Title */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    {product.ProductName}
                  </h3>

                  <p className="text-md font-semibold ml-2 text-black mt-2">
                    {product.ProductPrice ? formatPrice(product.ProductPrice) : 'Price not available'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      ) : (
        <div className="flex justify-center items-center h-40">
          <div className="text-lg text-gray-600">No products available</div>
        </div>
      )}
    </div>
  );
};

export default Promotion;
