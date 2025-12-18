import React, { useState, useMemo } from 'react';

const BuyerItems = ({ items = [], categories = [] }) => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const [selectedItem, setSelectedItem] = useState(null);

    const categoryOptions = useMemo(() => [{ id: 'all', name: 'All' }, ...categories], [categories]);

    const filtered = useMemo(() => {
        let list = items.slice();

        if (selectedCategory !== 'all') {
            list = list.filter(i => (i.categoryId || '') === selectedCategory);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(i =>
                (i.name || '').toLowerCase().includes(q) ||
                (i.department || '').toLowerCase().includes(q) ||
                (i.id || '').toLowerCase().includes(q)
            );
        }

        if (sortBy === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        else if (sortBy === 'issuedDate') list.sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate));

        return list;
    }, [items, categories, selectedCategory, search, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="max-w-6xl mx-auto p-6 pb-24">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Browse Items</h2>

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <input
                    aria-label="Search items"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search by name, department or ID"
                    className="flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />

                <select
                    value={selectedCategory}
                    onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
                    className="px-3 py-2 border rounded-md"
                >
                    {categoryOptions.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                >
                    <option value="name">Sort: Name</option>
                    <option value="issuedDate">Sort: Newest</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pageItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">ID: {item.id}</p>
                            <p className="text-sm text-gray-600">Department: {item.department}</p>
                            <p className="text-sm text-gray-600">Issued: {item.issuedDate}</p>
                            <p className="text-sm text-gray-600">Category: {categories.find(c => c.id === item.categoryId)?.name || 'N/A'}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-end">
                            <button
                                onClick={() => setSelectedItem(item)}
                                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                View
                            </button>
                          
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 flex items-center justify-center space-x-3 z-40">

                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >Prev</button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >Next</button>
            </div>

            {selectedItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-xl w-full p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                            <button 
                                onClick={() => setSelectedItem(null)} 
                                className="text-red-500 hover:text-red-600 text-[20px] bold border-none bg-transparent "
                                aria-label="Close details"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                            <p><strong>ID:</strong> {selectedItem.id}</p>
                            <p><strong>Department:</strong> {selectedItem.department}</p>
                            <p><strong>Issued:</strong> {selectedItem.issuedDate}</p>
                            <p><strong>Category:</strong> {categories.find(c => c.id === selectedItem.categoryId)?.name || 'N/A'}</p>
                            {selectedItem.dynamic_attributes && (
                                <div>
                                    <strong>Details:</strong>
                                    <ul className="list-disc ml-5 mt-1">
                                        {Object.entries(selectedItem.dynamic_attributes).map(([k, v]) => (
                                            <li key={k}>{k}: {String(v)}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                       
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyerItems;
