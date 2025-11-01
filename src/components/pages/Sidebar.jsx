
import React from 'react';
import { X } from 'lucide-react';

export default function Sidebar({
  title,
  navItems,
  activeItem,
  handleItemClick,
  isSidebarOpen,
  setIsSidebarOpen
}) {
  const handleNavClick = (itemId) => {
    handleItemClick(itemId);
    // Auto-close sidebar on mobile after click
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const SidebarNav = () => (
    <nav className="flex flex-col p-4 space-y-2">
      <div className="mb-6 px-3 py-2">
        <h2 className="text-xl font-bold text-gray-800">{title || 'Menu'}</h2>
      </div>
      {navItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            handleNavClick(item.id);
          }}
          className={`block w-full text-left p-3 hover:cursor-pointer rounded-lg border transition-all duration-200 ${
            activeItem === item.id
              ? 'bg-blue-500 text-white border-blue-500 shadow-md transform scale-105'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm'
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar (overlay/slide-in), shows if isSidebarOpen */}
      <aside
        className={`fixed inset-0 bg-white z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden pt-0`}
        style={{top: 0}}
      >
        {/* Close button at top left */}
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={28} />
          </button>
          <h2 className="text-xl font-bold text-gray-800">{title || 'Menu'}</h2>
          <span className="w-7"/> {/* filler for symmetry */}
        </div>
        <SidebarNav />
      </aside>

      {/* Desktop Sidebar (static) */}
      <aside className="hidden md:block w-64 bg-white shadow-lg flex-shrink-0">
        <SidebarNav />
      </aside>
    </>
  );
}



// import React, { memo } from 'react';
// import { X } from 'lucide-react';

// const Sidebar = memo(({ 
//   title, 
//   navItems, 
//   activeItem, 
//   handleItemClick, 
//   isSidebarOpen, 
//   setIsSidebarOpen 
// }) => {
//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside className="hidden md:flex md:flex-col md:w-64 lg:w-72 bg-white border-r border-gray-200 shadow-sm">
//         <div className="p-4 border-b border-gray-200">
//           <h2 className="text-lg font-bold text-gray-800">{title}</h2>
//         </div>
        
//         <nav className="flex-1 overflow-y-auto p-3">
//           <div className="space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => handleItemClick(item.id)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
//                     activeItem === item.id
//                       ? 'bg-blue-600 text-white shadow-md'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   <Icon size={20} className="flex-shrink-0" />
//                   <span className="font-medium">{item.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </nav>
//       </aside>

//       {/* Mobile Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <h2 className="text-lg font-bold text-gray-800">{title}</h2>
//           <button
//             onClick={() => setIsSidebarOpen(false)}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             aria-label="Close menu"
//           >
//             <X size={20} className="text-gray-700" />
//           </button>
//         </div>

//         <nav className="overflow-y-auto p-3 h-[calc(100vh-4rem)]">
//           <div className="space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => handleItemClick(item.id)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
//                     activeItem === item.id
//                       ? 'bg-blue-600 text-white shadow-md'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   <Icon size={20} className="flex-shrink-0" />
//                   <span className="font-medium">{item.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </nav>
//       </aside>
//     </>
//   );
// });

// Sidebar.displayName = 'Sidebar';

// export default Sidebar;