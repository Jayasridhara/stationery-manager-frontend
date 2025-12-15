import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { categoriesAPI, itemsAPI } from './api/apiClient';
import Navigation from './components/Navigation';
import ItemManager from './components/ItemManager';
import CategoryManager from './components/CategoryManager';
import Login from './components/Login';

// Helper function to reorder arrays (used for categories)
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

function App() {
    // --- State Management ---
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        try {
            return localStorage.getItem('isAuthenticated') === 'true';
        } catch (e) {
            return false;
        }
    });
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch categories and items from backend on mount and after authentication
    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [categoriesData, itemsData] = await Promise.all([
                categoriesAPI.getAll(),
                itemsAPI.getAll(),
            ]);
            setCategories(categoriesData);
            setItems(itemsData);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // FR4: Session timeout simulation (Basic)
    useEffect(() => {
        let timeout;
        if (isAuthenticated) {
            timeout = setTimeout(() => {
                handleLogout();
                alert('Session timed out. Please login again.');
            }, 15 * 60 * 1000);
        }
        return () => clearTimeout(timeout);
    }, [isAuthenticated]);

    // --- User Authentication (FR1, FR2, FR3) ---
    const handleLogin = () => {
        setIsAuthenticated(true);
        try { localStorage.setItem('isAuthenticated', 'true'); } catch (e) {}
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        try { localStorage.removeItem('isAuthenticated'); } catch (e) {}
    };

    // --- Item Management Handlers (FR6, FR8, FR10) ---
    const handleAddItem = async (newItemData) => {
        try {
            const addedItem = await itemsAPI.create(newItemData);
            setItems([...items, addedItem]);
        } catch (err) {
            setError(err.message);
            console.error('Error adding item:', err);
            alert('Failed to add item: ' + err.message);
        }
    };

    const handleUpdateItem = async (id, updatedData) => {
        try {
            const updatedItem = await itemsAPI.update(id, updatedData);
            setItems(items.map(item => item.id === id ? updatedItem : item));
        } catch (err) {
            setError(err.message);
            console.error('Error updating item:', err);
            alert('Failed to update item: ' + err.message);
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await itemsAPI.delete(id);
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting item:', err);
            alert('Failed to delete item: ' + err.message);
        }
    };

    // --- Category Management Handlers (FR14) ---
    const handleAddCategory = async (name) => {
        try {
            const newCat = await categoriesAPI.create(name);
            setCategories([...categories, newCat]);
        } catch (err) {
            setError(err.message);
            console.error('Error adding category:', err);
            alert('Failed to add category: ' + err.message);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await categoriesAPI.delete(id);
            setCategories(categories.filter(cat => cat.id !== id));
            // FR13: Automatically update category associations
            setItems(items.map(item => item.categoryId === id ? { ...item, categoryId: null } : item));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting category:', err);
            alert('Failed to delete category: ' + err.message);
        }
    };

    // --- Drag-and-Drop Logic (FR12 & FR13) ---
    const onDragEnd = async (result) => {
        const { source, destination, type, draggableId } = result;

        if (!destination) return;

        // 1. Reordering Categories (Type: category)
        if (type === 'category') {
            const reorderedCategories = reorder(categories, source.index, destination.index);
            setCategories(reorderedCategories);
            return;
        }

        // 2. Moving Items between/within Categories (Type: item)
        // FR13: Automatically update category associations
        
        setItems(prevItems => {
            let updatedItems = Array.from(prevItems);
            
            // Find the item being dragged
            const draggedItem = updatedItems.find(item => item.id === draggableId);
            if (!draggedItem) return prevItems;

            // Update the categoryId (handles moving across categories - FR13)
            const newCategoryId = destination.droppableId;
            if (draggedItem.categoryId !== newCategoryId) {
                draggedItem.categoryId = newCategoryId;
                
                // Update in backend
                itemsAPI.update(draggableId, { ...draggedItem })
                    .catch(err => {
                        console.error('Error updating item category:', err);
                        alert('Failed to update item category');
                    });
            }
            
            return updatedItems;
        });
    };
    // ------------------------------------------

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-medium">Error loading data</p>
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                    <button 
                        onClick={fetchData}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navigation onLogout={handleLogout} /> 
                <main className="py-6">
                    <Routes>
                        <Route path="/" element={<Navigate to="/items" replace />} />
                        
                        <Route 
                            path="/items" 
                            element={<ItemManager 
                                items={items} 
                                categories={categories}
                                onAddItem={handleAddItem}
                                onUpdateItem={handleUpdateItem}
                                onDeleteItem={handleDeleteItem}
                            />} 
                        />
                        
                        <Route 
                            path="/categories" 
                            element={<CategoryManager 
                                categories={categories}
                                items={items} 
                                onAddCategory={handleAddCategory}
                                onDeleteCategory={handleDeleteCategory}
                                onDragEnd={onDragEnd} // DND handler
                            />} 
                        />
                        
                        <Route path="*" element={
                            <div className="text-center p-10">
                                <h1 className="text-4xl font-bold text-gray-800">404 - Not Found</h1>
                                <p className="text-gray-500 mt-2">The page you are looking for does not exist.</p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;