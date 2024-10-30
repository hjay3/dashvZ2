import React from 'react';

const GridHeader = () => {
  const headers = ['Emotion', 'Level 1', 'Lvl 2', 'Lvl 3', 'Badge 1', 'Badge 2', 'Badge 3'];

  return (
    <div className="grid grid-cols-7 gap-4 mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {headers.map((header, index) => (
        <div
          key={index}
          className="text-center font-bold text-gray-700 dark:text-gray-200"
        >
          {header}
        </div>
      ))}
    </div>
  );
};

export default GridHeader;