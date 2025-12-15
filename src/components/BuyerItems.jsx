import React from 'react';

const BuyerItems = ({ items, categories }) => {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Browse Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">ID: {item.id}</p>
                        <p className="text-sm text-gray-600">Department: {item.department}</p>
                        <p className="text-sm text-gray-600">Issued: {item.issuedDate}</p>
                        <p className="text-sm text-gray-600">Category: {categories.find(c => c.id === item.categoryId)?.name || 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyerItems;
