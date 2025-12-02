import React, { useMemo, useCallback } from "react";
import { FiHome, FiUsers, FiBook, FiFileText, FiCalendar, FiSettings, FiX } from "react-icons/fi";

const Sidebar = React.memo(({ isOpen, onToggle, menuItems, selectedMenu, onMenuClick }) => {
  const iconMap = useMemo(() => ({
    home: FiHome,
    student: FiUsers,
    faculty: FiUsers,
    branch: FiBook,
    notice: FiFileText,
    exam: FiCalendar,
    subjects: FiBook,
    admin: FiSettings,
  }), []);

  const handleMenuClick = useCallback((itemId) => {
    onMenuClick(itemId);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  }, [onMenuClick, onToggle]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-20 left-0 h-[calc(100vh-80px)] bg-white shadow-2xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-xl font-bold text-white">Dashboard</h2>
            <button
              onClick={onToggle}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              title="Close Sidebar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = iconMap[item.id] || FiHome;
                const isSelected = selectedMenu === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      type="button"
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-all duration-200
                        ${
                          isSelected
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {isSelected && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;

