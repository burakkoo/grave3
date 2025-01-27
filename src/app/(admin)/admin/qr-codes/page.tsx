'use client';
import React, { useRef, useState } from 'react';
import DashboardLayout from '@/components/admin/dashboard';
import DataTable from '@/components/admin/qr-database';
import { useToast } from '@/hooks/useToast'; // Import the useToast hook

type DataTableRefType = {
  refresh: () => void;
};

const AdminDashboard: React.FC = () => {
  const dataTableRef = useRef<DataTableRefType>(null); // Create a ref for DataTable
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [qrCodeCount, setQrCodeCount] = useState<number>(10); // State for the number of QR codes
  const { showToast } = useToast(); // Destructure showToast from useToast

  const MakeQrCodes = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch('/api/admin/qr_code', {
        method: 'POST',
        body: JSON.stringify({ count: qrCodeCount }), // Use the qrCodeCount from state
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'QR Codes Created',
          message: `Successfully created ${qrCodeCount} new QR codes.`,
        });
        dataTableRef.current?.refresh(); // Trigger the refresh method on DataTable
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to create QR codes.',
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-4 flex flex-1 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Input for number of QR codes */}
          <label className="text-gray-800">Number of QR Codes:</label>
          <input
            type="number"
            value={qrCodeCount}
            onChange={(e) => setQrCodeCount(Number(e.target.value))}
            min="1"
            className="rounded-lg border px-4 py-2 text-gray-800"
            disabled={isLoading}
          />
          <button
            onClick={MakeQrCodes}
            className={`rounded-lg bg-gray-800 px-4 py-2 hover:bg-gray-500 ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create More'}
          </button>
        </div>
      </div>
      <DataTable ref={dataTableRef} /> {/* Attach the ref to DataTable */}
    </DashboardLayout>
  );
};

export default AdminDashboard;
