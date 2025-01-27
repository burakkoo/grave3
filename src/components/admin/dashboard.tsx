// src/app/protected/admin/components/DashboardLayout.tsx
import React from 'react';
import Sidebar from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area on the right */}
      <main className="flex-1 overflow-auto bg-gray-100 p-5">{children}</main>
    </div>
  );
};

export default DashboardLayout;
