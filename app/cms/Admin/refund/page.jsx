'use client';

import React from 'react';
import Layout from '../../Components/Layout/Layout';
import { Geist } from 'next/font/google';
import Image from 'next/image';

const font = Geist({
    subsets: ['latin'],
});

const Refund = () => {
    const order = {
        id: '#349',
        customerId: '2364847',
        items: [
            {
                id: 1,
                name: 'Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management & Skin Temperature Trends...',
                size: '42',
                image: '/mini-laptop.png',
            },
            {
                id: 2,
                name: '2021 Apple 12.9-inch iPad Pro (Wi-Fi, 128GB) - Space Gray',
                size: 'Pro',
                image: '/mini-laptop.png',
            },
            {
                id: 3,
                name: 'PlayStation 5 DualSense Wireless Controller',
                size: 'Regular',
                image: '/mini-laptop.png',
            },
            {
                id: 4,
                name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
                size: 'Pro',
                image: '/mini-laptop.png',
            },
            {
                id: 5,
                name: 'Apple iMac 24" 4K Retina Display M1 8 Core CPU, 7 Core GPU, 256GB SSD, Green (MIV832P/A) 2021',
                size: '21"',
                image: '/mini-laptop.png',
            },
            {
                id: 6,
                name: 'Apple Magic Mouse (Wireless, Rechargable) - Silver',
                size: 'Regular',
                image: '/mini-laptop.png',
            },
        ],
    };

    const summary = {
        subtotal: '$7,686',
        discount: '-$59',
        tax: '$126.2',
        shipping: '$30',
        total: '$695.20',
    };

    return (
        <Layout>
            <div className={`${font.className} p-12 bg-gray-50 min-h-screen`}>
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>Page 1</span>
                    <span className="mx-2">â€¢</span>
                    <span>Page 2</span>
                    <span className="mx-2">â€¢</span>
                    <span>Default</span>
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-3xl font-bold">Refund</h1>
                    <button className="text-gray-600 hover:text-gray-800">
                        More action
                        <span className="ml-2">â–¼</span>
                    </button>
                </div>

                {/* Order Info */}
                <div className="mb-6">
                    <span className="text-gray-600">Order : </span>
                    <span className="text-blue-600 font-medium">{order.id}</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-gray-600">Customer Id : </span>
                    <span className="text-blue-600 font-medium">{order.customerId}</span>
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Products Table */}
                    <div className="flex-1">
                        <table className="w-ful border-y border-gray-200">
                            <thead>
                                <tr>
                                    <th className="text-left px-6 py-2 text-xs font-bold uppercase tracking-wider w-2/3">Products</th>
                                    <th className="text-left px-6 py-2 text-xs font-bold uppercase tracking-wider">Size</th>
                                </tr>
                            </thead>
                            <tbody className="border-y border-gray-200">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border-y border-gray-200 px-4 py-2">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-[0.8rem] text-blue-600 hover:text-blue-800 cursor-pointer">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-y border-gray-200 px-6 py-4 text-[0.8rem] text-gray-600">{item.size}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Items Subtotal */}
                        <div className="mt-4 mb-8 flex justify-between border-b border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">
                                Items subtotal :
                            </h2>
                            <span className="text-gray-900">{summary.subtotal}</span>
                        </div>
                    </div>

                    {/* Summary and Refund Section */}
                    <div className="lg:w-80 flex flex-col gap-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Items subtotal :</span>
                                    <span className="text-gray-900">{summary.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-red-500">Discount :</span>
                                    <span className="text-red-500">{summary.discount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax :</span>
                                    <span className="text-gray-900">{summary.tax}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping Cost :</span>
                                    <span className="text-gray-900">{summary.shipping}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t">
                                    <span className="font-medium">Total :</span>
                                    <span className="font-medium">{summary.total}</span>
                                </div>
                            </div>
                        </div>

                        {/* Refund Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div>
                                <p className="text-md font-semibold pb-2">Refund Amount</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Amount"
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                                Refund $500
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Refund;