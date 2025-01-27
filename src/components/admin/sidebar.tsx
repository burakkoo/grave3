// src/app/protected/admin/components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <nav className="h-full w-auto bg-gray-800 p-6 text-white">
      <ul className="space-y-4">
        <li>
          <Link href="/admin/dashboard">
            <p className="block rounded p-2 hover:bg-gray-700">Dashboard</p>
          </Link>
        </li>
        <li>
          <Link href="/admin/users">
            <p className="block rounded p-2 hover:bg-gray-700">Users</p>
          </Link>
        </li>
        <li>
          <Link href="/admin/qr-codes">
            <p className="block rounded p-2 hover:bg-gray-700">QR Codes</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
