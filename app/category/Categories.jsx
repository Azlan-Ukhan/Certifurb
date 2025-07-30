'use client';

import React, { useState, useEffect } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { font } from '../Components/Font/font';
import Link from 'next/link';
import { formatPrice } from '../utils/priceFormatter';

// Keep the fallback for demonstration
const baseProduct = {
  name: 'Lenovo Thinkpad T470s Core-i7-7th-Gen',
  specs: '8GB-256 GB SSD-14"-Win 10',
  price: formatPrice(130000),
  discount: '45% vs. new',
  image: '/laptop.png',
};

const PRICE_MIN = 500;
const PRICE_MAX = 500000;

const Categories = ({ categoryFilter, brandFilter }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset price range when component mounts or filters change
  useEffect(() => {
    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
  }, [categoryFilter, brandFilter]);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching products from API...');
        const response = await fetch('http://localhost:5000/api/products');
        console.log('API Response status:', response.status);
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.success) {
          console.log('Raw products from database:', data.data);
          console.log('Number of products received:', data.data.length);
          
          // Map database fields to card structure
          const mappedProducts = data.data.map(product => {
            console.log('Mapping product:', product);
            return {
              id: product.ProductID,
              name: product.ProductName,
              specs: product.ProductDesc || 'High-quality refurbished product',
              price: formatPrice(product.ProductPrice),
              discount: '45% vs. new', // You can calculate this based on your logic
              image: product.ProductImageURL || '/laptop.png',
              category: product.ProductCategory,
              brand: product.ProductBrand,
              storage: product.ProductStorage,
              ram: product.ProductRam,
              keyboard: product.ProductKeyboard,
              screenSize: product.ProductScreenSize
            };
          });
          console.log('Mapped products:', mappedProducts);
          setProducts(mappedProducts);
        } else {
          console.error('API returned error:', data);
          setError(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100; // Reduced from 1000 to 100 for better flexibility
    if (e.target.name === 'min') {
      setPriceMin(Math.min(value, priceMax - minDifference));
    } else {
      setPriceMax(Math.max(value, priceMin + minDifference));
    }
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100; // Reduced from 1000 to 100 for better flexibility
    if (e.target.name === 'min') {
      setPriceMin(Math.max(PRICE_MIN, Math.min(value, priceMax - minDifference)));
    } else {
      setPriceMax(Math.min(PRICE_MAX, Math.max(value, priceMin + minDifference)));
    }
  };

  const handleShowMore = () => {
    setVisibleCount(Math.min(products.length, visibleCount + 8));
  };

  const handleShowLess = () => {
    setVisibleCount(12);
  };

  // Filter products by price range, category, and brand (only if products are loaded)
  const filteredProducts = products.length > 0 ? products.filter(product => {
    console.log('Filtering product:', product);
    
    if (!product || !product.price) {
      console.log('❌ Product or price is missing:', product);
      return false;
    }
    
    // Price filtering
    const priceString = product.price; // e.g., "PKR 200,000"
    const priceNumber = parseFloat(product.price.replace(/[^\d.]/g, '')); // e.g., 200000
    const isInPriceRange = priceNumber >= priceMin && priceNumber <= priceMax;
    
    // Category filtering
    let isInCategory;
    if (!categoryFilter) {
      isInCategory = true;
    } else if (categoryFilter === 'Monitors') {
      // For Monitors filter, show both LCD and LED products
      isInCategory = product.category === 'LCD' || product.category === 'LED';
    } else {
      isInCategory = product.category === categoryFilter;
    }
    
    // Brand filtering
    let isInBrand;
    if (!brandFilter) {
      isInBrand = true;
    } else {
      isInBrand = product.brand && product.brand.toLowerCase() === brandFilter.toLowerCase();
    }
    
    console.log(`Product: ${product.name}`);
    console.log(`  Price String: "${priceString}"`);
    console.log(`  Price Number: ${priceNumber}`);
    console.log(`  Price Min: ${priceMin}, Price Max: ${priceMax}`);
    console.log(`  In Price Range: ${isInPriceRange}`);
    console.log(`  Category: ${product.category}`);
    console.log(`  Category Filter: ${categoryFilter}`);
    console.log(`  In Category: ${isInCategory}`);
    console.log(`  Brand: ${product.brand}`);
    console.log(`  Brand Filter: ${brandFilter}`);
    console.log(`  In Brand: ${isInBrand}`);
    console.log(`  Final Result: ${isInPriceRange && isInCategory && isInBrand}`);
    console.log('---');
    
    return isInPriceRange && isInCategory && isInBrand;
  }) : [];

  console.log('=== SUMMARY ===');
  console.log('Total products:', products.length);
  console.log('Filtered products:', filteredProducts.length);
  console.log('Price range:', priceMin, '-', priceMax);
  console.log('Visible count:', visibleCount);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  console.log('Displayed products:', displayedProducts.length);
  console.log('================');

  return (
    <div className={`${font.className} w-full min-h-screen bg-[#fafbfc] flex flex-col items-center`}>
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 mt-4 lg:mt-6">
        {/* Filters Sidebar - Mobile: top, Desktop: left */}
        <div className="w-full lg:w-[260px] bg-white rounded-xl shadow p-4 flex flex-col gap-4 lg:gap-6 border border-gray-200 lg:h-fit lg:sticky lg:top-8">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-md">Price</div>
              <button 
                onClick={() => {
                  setPriceMin(PRICE_MIN);
                  setPriceMax(PRICE_MAX);
                }}
                className="text-xs text-green-500 hover:text-green-600 font-semibold"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                name="min"
                value={priceMin}
                min={PRICE_MIN}
                max={priceMax - 100}
                onChange={handleInputChange}
                className="w-20 px-3 py-1 rounded-lg border border-gray-300 shadow-sm text-xs font-semibold focus:ring-2 focus:ring-green-400 focus:border-green-400 transition outline-none text-center bg-[#f7f7f7]"
                style={{ boxShadow: '0 1px 4px 0 #e5e7eb' }}
              />
              <span className="text-gray-400 font-bold">-</span>
              <input
                type="number"
                name="max"
                value={priceMax}
                min={priceMin + 100}
                max={PRICE_MAX}
                onChange={handleInputChange}
                className="w-20 px-3 py-1 rounded-lg border border-gray-300 shadow-sm text-xs font-semibold focus:ring-2 focus:ring-green-400 focus:border-green-400 transition outline-none text-center bg-[#f7f7f7]"
                style={{ boxShadow: '0 1px 4px 0 #e5e7eb' }}
              />
            </div>
            <div className="relative h-8 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
              <div
                className="absolute h-1 bg-green-400 rounded-full"
                style={{
                  left: `${((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                  right: `${100 - ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                }}
              />
              <input
                type="range"
                name="min"
                min={PRICE_MIN}
                max={PRICE_MAX - 100}
                value={priceMin}
                onChange={handleSliderChange}
                className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                style={{ zIndex: 1 }}
              />
              <input
                type="range"
                name="max"
                min={PRICE_MIN + 100}
                max={PRICE_MAX}
                value={priceMax}
                onChange={handleSliderChange}
                className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                style={{ zIndex: 2 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>{PRICE_MIN.toLocaleString()}</span>
              <span>{PRICE_MAX.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Storage Filter */}
          <div>
            <div className="font-bold text-md mb-2">Storage</div>
            <div className="flex flex-col gap-1 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" /> 128GB</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> 256GB</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> 512GB</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> 1TB</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> 2TB</label>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <div className="flex-1 flex flex-col items-center">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {displayedProducts.map((item, idx) => (
                  <Link key={item.id || idx} href={`/product/${item.id}`}>
                    <div className="bg-white rounded-xl shadow p-4 border border-gray-500 relative flex flex-col min-h-[340px] max-w-[220px] mx-auto group transition hover:shadow-lg cursor-pointer">
                      <span className="absolute top-2 left-2 bg-green-400 text-white text-xs font-semibold py-1 px-2 rounded-full z-10">
                        {item.discount}
                      </span>
                      <div className="absolute top-2 right-2 text-black hover:text-gray-600 cursor-pointer z-10"
                           onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             // Add to wishlist logic here
                           }}>
                        <FaRegHeart />
                      </div>
                      <img src={item.image} alt={item.name} className="w-full h-36 mt-6 object-contain my-2" />
                      <h3 className="text-base font-bold text-gray-800 mt-2 line-clamp-2 min-h-[44px]">{item.name}</h3>
                      <div className="text-sm text-gray-500 mb-1 font-medium">{item.specs}</div>
                      <p className="text-lg font-bold text-black mt-auto">{item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Show More/Less Buttons */}
              {visibleCount < filteredProducts.length && (
                <div className="w-full flex justify-center mt-6 lg:mt-8 mb-4">
                  <button onClick={handleShowMore} className="bg-white border border-green-400 text-green-500 px-6 py-2 rounded-full font-semibold shadow hover:bg-green-50 transition">Show More Products</button>
                </div>
              )}
              {visibleCount >= filteredProducts.length && filteredProducts.length > 12 && (
                <div className="w-full flex justify-center mt-6 lg:mt-8 mb-4">
                  <button onClick={handleShowLess} className="bg-white border border-green-400 text-green-500 px-6 py-2 rounded-full font-semibold shadow hover:bg-green-50 transition">Show Less Products</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 mb-8">
        {loading ? 'Loading...' : `Showing 1-${Math.min(visibleCount, filteredProducts.length)} of ${filteredProducts.length} products`}
      </div>
    </div>
  );
};

export default Categories;