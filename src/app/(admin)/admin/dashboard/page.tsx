// src/app/protected/admin/index.tsx
'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/admin/dashboard';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(ArcElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

interface QR {
  id: string;
  code: string;
  used: boolean;
  userId: string;
  activationCode: string;
  updatedAt: string;
  user: {
    name: string;
  };
}

const AdminDashboard: React.FC = () => {
  const [guestUserCount, setGuestUserCount] = useState<number>(0);
  const [normalUserCount, setNormalUserCount] = useState<number>(0);
  const [postData, setPostData] = useState<{ date: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [qrCodes, setQrCodes] = useState<QR[]>([]);
  const [latestClaimedQR, setLatestClaimedQR] = useState<QR | null>(null);

  useEffect(() => {
    const fetchQrCodes = async () => {
      try {
        const response = await fetch('/api/admin/qr_code');
        const data: QR[] = await response.json();
        setQrCodes(data);

        // Filter QR codes where used is true and find the latest
        const claimedQRCodes = data.filter((qr) => qr.used);
        const latestQR = claimedQRCodes.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )[0];
        setLatestClaimedQR(latestQR || null);
      } catch (error) {
        console.error('Error fetching QR codes:', error);
      }
    };

    // Fetch guest users count
    const fetchGuestUsers = async () => {
      try {
        const response = await fetch('/api/admin/guest-users');
        const data = await response.json();
        setGuestUserCount(data.length);
      } catch (error) {
        console.error('Error fetching guest users:', error);
      }
    };

    // Fetch normal users count
    const fetchNormalUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        setNormalUserCount(data.length);
      } catch (error) {
        console.error('Error fetching normal users:', error);
      }
    };

    // Fetch post data and group by date
    const fetchPostData = async () => {
      try {
        const response = await fetch('/api/admin/posts');
        const data = await response.json();

        // Group posts by date
        const postsGroupedByDate: { [key: string]: number } = data.reduce(
          (acc: { [key: string]: number }, post: any) => {
            const date = format(new Date(post.createdAt), 'yyyy-MM-dd');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          },
          {},
        );

        // Convert to an array of { date, count }
        const processedData = Object.keys(postsGroupedByDate).map((date) => ({
          date,
          count: postsGroupedByDate[date],
        }));

        setPostData(processedData);
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    // Fetch all data
    const fetchData = async () => {
      setIsLoading(true);
      await fetchGuestUsers();
      await fetchNormalUsers();
      await fetchQrCodes();
      fetchPostData();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Data for the pie chart
  const pieData = {
    labels: ['Guest Users', 'Normal Users'],
    datasets: [
      {
        label: '# of Users',
        data: [guestUserCount, normalUserCount],
        backgroundColor: ['#87858A', '#A3BAE9'],
        hoverBackgroundColor: ['#87858A', '#A3BAE9'],
      },
    ],
  };

  // Data for the line chart
  const lineChartData = {
    labels: postData.map((item) => item.date),
    datasets: [
      {
        label: 'Posts per Day',
        data: postData.map((item) => item.count),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1,
      },
    ],
  };

  return (
    <DashboardLayout>
      {/* Dashboard heading */}
      <h1 className="mb-4 text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Main content container */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Users card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Users</h2>
          {isLoading ? (
            <p className="text-lg text-gray-950">Loading...</p>
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-lg text-gray-600">Guest Users: {guestUserCount}</p>
                <p className="text-lg text-gray-600">Normal Users: {normalUserCount}</p>
              </div>
              <div className="h-80 w-80">
                <Pie data={pieData} />
              </div>
            </div>
          )}
        </div>

        {/* Posts Per Day Line Chart */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Posts Per Day</h2>
          {isLoadingPosts ? (
            <p className="text-lg text-gray-950">Loading posts...</p>
          ) : (
            <div className="h-80 w-full">
              <Line data={lineChartData} />
            </div>
          )}
        </div>

        {/* Latest Updated Profiles Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Latest Updated Profiles</h2>
          <div className="space-y-2">
            <div className="rounded border p-3">
              <p className="text-gray-600">John Doe - Last Updated: 2024-12-18</p>
              <p className="text-gray-600">Jane Smith - Last Updated: 2024-12-17</p>
              <p className="text-gray-600">Alice Johnson - Last Updated: 2024-12-16</p>
              <p className="text-gray-600">Robert Brown - Last Updated: 2024-12-15</p>
              <p className="text-gray-600">Maria Garcia - Last Updated: 2024-12-14</p>
            </div>
          </div>
        </div>

        {/* Latest Claimed QR Code Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Latest Claimed QR Code</h2>
          {latestClaimedQR ? (
            <div className="space-y-2">
              <div className="rounded border p-3">
                <p className="mb-4 text-base text-gray-600">
                  <span className="font-bold">Claimed By:</span> {latestClaimedQR.user.name}
                </p>
                <p className="text-base text-gray-600">
                  <span className="font-bold">QR Code ID:</span> {latestClaimedQR.code}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-600">No claimed QR codes found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
