import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { AiOutlineDashboard, AiOutlineUser, AiOutlineSwap } from 'react-icons/ai';

const SidebarOptions = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <AiOutlineDashboard />,
  },
  {
    name: 'Accounts',
    path: '/dashboard/accounts',
    icon: <AiOutlineUser />,
  },
  {
    name: 'Transfers',
    path: '/dashboard/transfers',
    icon: <AiOutlineSwap />,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-[240px] bg-gray-900 text-gray-300 flex flex-col p-4 shadow-md">
      {/* Logo Section */}
      <h1
        className="text-2xl font-semibold text-gray-100 mb-8 cursor-pointer text-center hover:text-gray-200"
        onClick={() => navigate('/')}
      >
        Infy Space
      </h1>

      {/* Navigation Options */}
      <div className="flex flex-col gap-3">
        {SidebarOptions.map((option) => (
          <Link
            key={option.name}
            to={option.path}
            className={`flex items-center gap-3 p-2 rounded-md text-sm transition ${
              location.pathname === option.path
                ? 'bg-gray-800 text-blue-400'
                : 'hover:bg-gray-800 hover:text-white'
            }`}
          >
            {option.icon}
            <span>{option.name}</span>
          </Link>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="mt-auto text-center border-t border-gray-700 pt-4">
        <img
          src={user?.avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full mx-auto border-2 border-blue-400 mb-2"
        />
        <h2 className="text-sm font-medium text-gray-100">{user?.name}</h2>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full bg-red-500 hover:bg-red-600 text-sm text-white py-2 mt-4 rounded-md transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
