// src/app/protected/admin/index.tsx
'use client';
import React from 'react';
import DashboardLayout from '@/components/admin/dashboard';
import DataTable from '@/components/admin/database';

const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">User Management</h1>
      <DataTable />
    </DashboardLayout>
  );
};

export default AdminDashboard;
