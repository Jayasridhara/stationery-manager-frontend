import React, { useState } from 'react';

const ItemManager = ({ items, categories, onAddItem, onUpdateItem, onDeleteItem }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    // Initial state for new item (FR6)
    const initialItemState = {
        name: '',
        department: '',
        issuedDate: new Date().toISOString().substring(0, 10),
        categoryId: categories[0]?.id || '',
        serialNumber: '', // FR9: Dynamic field example
    };

    const [newItem, setNewItem] = useState(initialItemState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // FR7: Validate mandatory fields
        if (!newItem.name || !newItem.department || !newItem.issuedDate) {
            alert('Please fill all mandatory fields (Name, Department, Issued Date).');
            return;
        }

        // Check if we're editing an existing item (has an ID) or creating a new one
        if (currentItem && currentItem.id) {
            onUpdateItem(currentItem.id, newItem); // FR8, FR10
        } else {
            onAddItem(newItem); // FR6
        }
        
        setIsAdding(false);
        setCurrentItem(null);
        setNewItem(initialItemState);
    };

    // FR8: Edit existing item
    const handleEdit = (item) => {
        setCurrentItem(item);
        setNewItem(item);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setCurrentItem(null);
        setNewItem(initialItemState);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Item Management</h2>
                <button 
                    onClick={isAdding ? handleCancel : () => handleEdit(initialItemState)} // Pass initial state to clear form
                    className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition duration-150 
                        ${isAdding ? 'bg-gray-400 text-white hover:bg-gray-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                    {isAdding ? 'Cancel' : 'Add New Item'}
                </button>
            </div>

            {isAdding && (
                <div className="p-6 mb-8 border border-indigo-200 rounded-xl bg-indigo-50 shadow-inner">
                    <h3 className="text-xl font-medium mb-4 text-indigo-800">{currentItem && currentItem.id ? 'Edit Item' : 'Add New Item'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* FR6: Mandatory Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Name*</label>
                            <input type="text" name="name" value={newItem.name} onChange={handleInputChange} required 
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department Issued To*</label>
                            <input type="text" name="department" value={newItem.department} onChange={handleInputChange} required 
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Issued Date*</label>
                            <input type="date" name="issuedDate" value={newItem.issuedDate} onChange={handleInputChange} required 
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        
                        {/* Category Association */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="categoryId" value={newItem.categoryId} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* FR9: Support dynamic input fields (Simulated via 'serialNumber') */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Serial Number (Dynamic Field)</label>
                            <input type="text" name="serialNumber" value={newItem.serialNumber} onChange={handleInputChange} 
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button type="submit" 
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150">
                                {currentItem && currentItem.id ? 'Update Item' : 'Save Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <h3 className="text-xl font-medium mb-4">Existing Items</h3>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['ID', 'Name', 'Department', 'Issued Date', 'Category', 'Actions'].map(header => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.issuedDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{categories.find(c => c.id === item.categoryId)?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleEdit(item)} 
                                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150">
                                        Edit
                                    </button>
                                    {/* FR8: Delete existing item */}
                                    <button
                                    className="text-red-600 hover:text-red-900 transition duration-150"
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete?")) {
                                        onDeleteItem(item.id);
                                        }
                                    }}
                                    >
                                    Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ItemManager;