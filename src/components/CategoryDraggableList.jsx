import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ItemCard = ({ item, index }) => (
    <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`p-2 mt-2 text-sm rounded-md shadow-sm transition duration-150 
                            ${snapshot.isDragging ? 'bg-indigo-200 border-indigo-500' : 'bg-white border border-gray-200'} 
                            text-gray-700`}
            >
                {item.name}
                <span className="text-xs text-gray-400 ml-2">({item.id})</span>
            </div>
        )}
    </Draggable>
);

const CategoryDraggableList = ({ category, items, index }) => {
    return (
        <Draggable draggableId={category.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`p-4 rounded-xl shadow-lg transition duration-150 
                                ${snapshot.isDragging ? 'bg-yellow-100' : 'bg-gray-100'} 
                                border border-gray-300`}
                >
                    {/* Handle for dragging the entire category */}
                    <h3 
                        {...provided.dragHandleProps}
                        className="text-lg font-semibold mb-3 text-indigo-700 cursor-grab"
                    >
                        {category.name} ({items.length})
                    </h3>
                    
                    {/* Droppable area for items within the category */}
                    <Droppable droppableId={category.id} type="item">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`min-h-[50px] p-2 rounded-md transition duration-150 
                                            ${snapshot.isDraggingOver ? 'bg-indigo-50' : ''}`}
                            >
                                {items.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">Drag items here</p>
                                )}
                                {items.map((item, itemIndex) => (
                                    <ItemCard key={item.id} item={item} index={itemIndex} />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    );
};

export default CategoryDraggableList;