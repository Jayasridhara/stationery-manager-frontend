import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import CategoryDraggableList from './CategoryDraggableList';

const CategoryManager = ({ categories, items, onAddCategory, onDeleteCategory, onDragEnd }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    
    // FR14: Create Category
    const handleAdd = () => {
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName);
            setNewCategoryName('');
        }
    };

    // Group items by category for the drag-and-drop view
    const categoriesMap = categories.reduce((map, cat) => {
        map[cat.id] = items.filter(item => item.categoryId === cat.id);
        return map;
    }, {});

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Category & Item Arrangement</h2>
            
            <div className="flex space-x-3 mb-8 p-4 border rounded-lg bg-gray-50">
                <input
                    type="text"
                    placeholder="Enter New Category Name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button 
                    onClick={handleAdd}
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition duration-150 disabled:opacity-50"
                    disabled={!newCategoryName.trim()}
                >
                    Create Category
                </button>
            </div>

            <h3 className="text-xl font-medium mb-4">Drag-and-Drop View (FR12)</h3>
            
            <DragDropContext onDragEnd={onDragEnd}>
                {/* Droppable area for categories (Type: category) */}
                <Droppable droppableId="all-categories" direction="horizontal" type="category">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="flex space-x-4 overflow-x-auto pb-4" 
                        >
                            {/* FR11, FR12: Display Categories and their Items */}
                            {categories.map((category, index) => (
                                <div key={category.id} className="min-w-[300px]">
                                    <CategoryDraggableList 
                                        category={category} 
                                        items={categoriesMap[category.id] || []} 
                                        index={index} 
                                    />
                                    {/* FR14: Delete categories */}
                                    <div className="mt-2 flex justify-end space-x-2">
                                        <button 
                                            onClick={() => onDeleteCategory(category.id)} 
                                            className="py-1 px-3 text-sm text-red-600 border border-red-400 rounded hover:bg-red-50"
                                        >
                                            Delete Category
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default CategoryManager;