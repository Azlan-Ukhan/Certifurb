"use client";

import React, { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram, FaPlus, FaMinus } from "react-icons/fa";
import { font } from '../Font/font';
import Link from 'next/link';

const aboutLinks = ["About Us", "Shop", "Become Seller", "Blog"];
const infoLinks = ["Help Center/FAQs", "Contact", "Terms & Conditions", "Privacy Policy"];
const accountLinks = ["Track Your Order", "My Account", "Claims"];

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({
    about: false,
    information: false,
    account: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className={`${font.className} w-full bg-[#232323] border-t-4 border-green-400 pt-8 pb-2 px-6 md:px-12`}>
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Logo and Contact */}
        <div className="mb-8">
          <img src="/secondary-logo.png" alt="Certifurb Logo" className="w-40 mb-6" />
        </div>

        {/* Collapsible About Us Section */}
        <div className="border-b border-gray-600 pb-4 mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('about')}
          >
            <h3 className="text-white text-lg font-semibold">About Us</h3>
            {expandedSections.about ? 
              <FaMinus className="text-white text-sm" /> : 
              <FaPlus className="text-white text-sm" />
            }
          </div>
          {expandedSections.about && (
            <ul className="mt-4 space-y-3">
              {aboutLinks.map((link, i) => (
                <li key={i} className="text-gray-300 text-sm cursor-pointer">{link}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Collapsible Information Section */}
        <div className="border-b border-gray-600 pb-4 mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('information')}
          >
            <h3 className="text-white text-lg font-semibold">Information</h3>
            {expandedSections.information ? 
              <FaMinus className="text-white text-sm" /> : 
              <FaPlus className="text-white text-sm" />
            }
          </div>
          {expandedSections.information && (
            <ul className="mt-4 space-y-3">
              {infoLinks.map((link, i) => (
                <li key={i} className="text-gray-300 text-sm cursor-pointer">{link}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Collapsible My Account Section */}
        <div className="border-b border-gray-600 pb-4 mb-8">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('account')}
          >
            <h3 className="text-white text-lg font-semibold">My Account</h3>
            {expandedSections.account ? 
              <FaMinus className="text-white text-sm" /> : 
              <FaPlus className="text-white text-sm" />
            }
          </div>
          {expandedSections.account && (
            <ul className="mt-4 space-y-3">
              {accountLinks.map((link, i) => (
                <li key={i} className="text-gray-300 text-sm cursor-pointer">
                  {link === "Track Your Order" ? (
                    <Link href="/track-order" className="hover:text-green-400">
                      {link}
                    </Link>
                  ) : (
                    link
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <div className="text-white text-md mb-2">info@certifurb.com</div>
          <div className="text-white text-md mb-4">+92-333-123-4567</div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 pb-4">
          <a href="#" className="text-green-400 hover:text-white"><FaFacebookF size={20} /></a>
          <a href="#" className="text-green-400 hover:text-white"><FaLinkedinIn size={20} /></a>
          <a href="#" className="text-green-400 hover:text-white"><FaYoutube size={20} /></a>
          <a href="#" className="text-green-400 hover:text-white"><FaInstagram size={20} /></a>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-8">
          {/* Left: Logo and Contact */}
          <div className="flex flex-col min-w-[220px]">
            <img src="/secondary-logo.png" alt="Certifurb Logo" className="w-52 mb-6" />
            <div className="text-white text-md ml-2 mb-1">info@certifurb.com</div>
            <div className="text-white text-md ml-2 mb-8">+92-333-123-4567</div>
          </div>
          {/* All Links on the right */}
          <div className="flex gap-8 ml-auto">
            {/* About Us */}
            <div>
              <div className="text-white font-semibold mb-3">About Us</div>
              <ul className="space-y-2">
                {aboutLinks.map((link, i) => (
                  <li key={i} className="text-gray-300 text-sm hover:text-green-400 cursor-pointer">{link}</li>
                ))}
              </ul>
            </div>
            {/* Information */}
            <div>
              <div className="text-white font-semibold mb-3">Information</div>
              <ul className="space-y-2">
                {infoLinks.map((link, i) => (
                  <li key={i} className="text-gray-300 text-sm hover:text-green-400 cursor-pointer">{link}</li>
                ))}
              </ul>
            </div>
            {/* My Account */}
            <div>
              <div className="text-white font-semibold mb-3">My Account</div>
              <ul className="space-y-2">
                {accountLinks.map((link, i) => (
                  <li key={i} className="text-gray-300 text-sm hover:text-green-400 cursor-pointer">
                    {link === "Track Your Order" ? (
                      <Link href="/track-order" className="hover:text-green-400">
                        {link}
                      </Link>
                    ) : (
                      link
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Row: Social Icons */}
        <div className="flex justify-end items-center border-t border-gray-700 mt-8 pt-3 pb-1">
          <div className="flex gap-6">
            <a href="#" className="text-green-400 hover:text-white"><FaFacebookF size={18} /></a>
            <a href="#" className="text-green-400 hover:text-white"><FaLinkedinIn size={18} /></a>
            <a href="#" className="text-green-400 hover:text-white"><FaYoutube size={18} /></a>
            <a href="#" className="text-green-400 hover:text-white"><FaInstagram size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;