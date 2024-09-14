'use client';

import React, { useState, useEffect } from 'react';

type CardData = {
  id: number;
  weight: number;
  content: React.ReactNode;
};

type ResponsiveCardGridProps = {
  initialCards: CardData[];
};

const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({ initialCards }) => {
  const [cards, setCards] = useState<CardData[]>([]);

  // Load cards from initialCards (localStorage code commented out for now)
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  // Drag and Drop Handlers (same as your current code)
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow a drop
    e.currentTarget.classList.add('border-2', 'border-dashed', 'border-black');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-2', 'border-dashed', 'border-black');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-2', 'border-dashed', 'border-black');
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

    if (dragIndex === dropIndex) return;

    const newCards = [...cards];
    const [draggedCard] = newCards.splice(dragIndex, 1);
    newCards.splice(dropIndex, 0, draggedCard);

    setCards(newCards);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className="flex flex-col h-auto mx-2 p-4 rounded-lg shadow-lg flex-shrink-0 min-h-[300px]  overflow-y-auto w-full md:w-auto mb-4 md:mb-0 bg-white text-black"
          style={{ flexGrow: card.weight }}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
            {card.content}
        </div>
      ))}
    </div>
  );
};

export default ResponsiveCardGrid;

