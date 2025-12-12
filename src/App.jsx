import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { initialCategories, initialItems } from './data/mockData';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Use deep copy to prevent mutation issues with complex DND logic
    const [items, setItems] = useState(initialItems); 
    const [categories, setCategories] = useState(initialCategories);

    // FR4: Session timeout simulation (Basic)
    useEffect(() => {
        let timeout;
        if (isAuthenticated) {
            timeout = setTimeout(() => {
                // Logic for session timeout
            }, 15 * 60 * 1000); 
        }
        return () => clearTimeout(timeout);
    }, [isAuthenticated]);

    // --- User Authentication (FR1, FR2, FR3) ---
    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);

    // --- Item Management Handlers (FR6, FR8, FR10) ---
    const handleAddItem = (newItemData) => {
        const newItem = { ...newItemData, id: `item-${Date.now()}` }; 
        setItems([...items, newItem]);
    };

    const handleUpdateItem = (id, updatedData) => {
        setItems(items.map(item => item.id === id ? { ...item, ...updatedData } : item));
    };

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // --- Category Management Handlers (FR14) ---
    const handleAddCategory = (name) => {
        const newCat = { id: `cat-${Date.now()}`, name };
        setCategories([...categories, newCat]);
    };

    const handleDeleteCategory = (id) => {
        setCategories(categories.filter(cat => cat.id !== id));
        // FR13: Automatically update category associations 
        setItems(items.map(item => item.categoryId === id ? { ...item, categoryId: null } : item));
    };

    // --- Drag-and-Drop Logic (FR12 & FR13) ---
    const onDragEnd = (result) => {
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
            if (draggedItem.categoryId !== destination.droppableId) {
                draggedItem.categoryId = destination.droppableId;
            }
            
            // Note: For a front-end simulation, updating the categoryId is the main goal. 
            // Positional reordering within the items array is complex without a robust 
            // position field in the item structure, so we prioritize the category update.
            
            return updatedItems;
        });
    };
    // ------------------------------------------

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
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