"use client";

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Geist } from "next/font/google";
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

const font = Geist({
  subsets: ["latin"],
});

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className={`${font.className} min-h-screen flex flex-col`}>
        {/* Navbar / Header */}
        <Navbar />

        {/* Main Content with Sidebar */}
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-50 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 