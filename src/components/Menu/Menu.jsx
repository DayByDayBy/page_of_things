import React from 'react';

const Menu = ({ onSelect }) => {
  const handleItemClick = (option) => {
    onSelect(option);
  };

  return (
    <div>
      <h2>wave modulation: </h2>
      <ul>
        <li onClick={() => handleItemClick('1')}>Option 1</li>
        <li onClick={() => handleItemClick('2')}>Option 2</li>
        <li onClick={() => handleItemClick('3')}>Option 3</li>
      </ul>
    </div>
  );
};

export default Menu;
