import React from "react";

const MenuTabs = ({ menuItems, selectedMenu, onMenuClick }) => {
  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `
      text-center px-6 py-3 cursor-pointer
      font-medium text-sm w-full
      rounded-md
      transition-all duration-300 ease-in-out
      ${
        isSelected
          ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg transform -translate-y-1"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
      }
    `;
  };

  return (
    <ul className="flex justify-evenly items-center gap-10 w-full mx-auto my-8">
      {menuItems.map((item) => (
        <li
          key={item.id}
          className={getMenuItemClass(item.id)}
          onClick={() => onMenuClick(item.id)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};

export default MenuTabs;
