import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ onLogout, role }) => {
    const location = useLocation();

    // Helper function to apply active class (FRD is satisfied by providing navigation)
    const getLinkClass = (path) => {
        return location.pathname === path
            ? "text-white bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
            : "text-gray-300 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium";
    };

    return (
        <header className="bg-indigo-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <span className="text-xl font-semibold text-white mr-8">Stationery Management System</span>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {role === 'admin' ? (
                                    <>
                                        <Link to="/items" className={getLinkClass('/items')}>
                                            Item Management
                                        </Link>
                                        <Link to="/categories" className={getLinkClass('/categories')}>
                                            Category Management
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/browse" className={getLinkClass('/browse')}>
                                        Browse Items
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        {/* FR3: Secure Log Out */}
                        <button 
                            onClick={onLogout} 
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium transition duration-150"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navigation;