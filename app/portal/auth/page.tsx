"use client"
import React from 'react';
import ResponsiveCardGrid from '@/app/components/ResponsiveCardGrid';

type CardData = {
  id: number;
  weight: number;
  content: React.ReactNode;
};

const initialCards: CardData[] = [
  {
    id: 1,
    weight: 1,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 1</h2>
        <p>This is content for Card 1.</p>
      </div>
    ),
  },
  {
    id: 2,
    weight: 2,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 2</h2>
        <p>This is content for Card 2.</p>
      </div>
    ),
  },
  {
    id: 3,
    weight: 3,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 3</h2>
        <p>This is content for Card 3.</p>
      </div>
    ),
  },
  {
    id: 4,
    weight: 1,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 4</h2>
        <p>This is content for Card 4.</p>
      </div>
    ),
  },
  {
    id: 5,
    weight: 2,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 5</h2>
        <p>This is content for Card 5.</p>
      </div>
    ),
  },
  {
    id: 6,
    weight: 3,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 6</h2>
        <p>This is content for Card 6.</p>
      </div>
    ),
  },
  {
    id: 7,
    weight: 1,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 7</h2>
        <p>This is content for Card 7.</p>
      </div>
    ),
  },
  {
    id: 8,
    weight: 2,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 8</h2>
        <p>This is content for Card 8.</p>
      </div>
    ),
  },
  {
    id: 9,
    weight: 3,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 9</h2>
        <p>This is content for Card 9.</p>
      </div>
    ),
  },
  {
    id: 10,
    weight: 2,
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-2">Card 10</h2>
        <p>This is content for Card 10.</p>
      </div>
    ),
  },
];

const Page: React.FC = () => {
  return (
    <div className="w-full h-[100vh] bg-red-300">
      <h1 className="text-2xl font-bold mb-4">Responsive Grid with Drag and Drop</h1>
      <ResponsiveCardGrid initialCards={initialCards} />
    </div>
  );
};

export default Page;

