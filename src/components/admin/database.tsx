import React, { useEffect, useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import ReactDOM from 'react-dom';
import SvgLoading from '@/svg_components/Loading';
import { buttonIconVariants } from '@/components/ui/variants/buttonVariants';
import { cn } from '@/lib/cn';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  qrCode: {
    code: string;
  };
}

const DataTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data.filter((user: User) => user.qrCode !== null));
    };

    fetchUsers();
  }, []);

  const downloadQRCode = (user: User) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    ReactDOM.render(
      <QRCodeCanvas
        value={`https://memoria-graveapp.vercel.app/memoria-page?qrCode=${user.qrCode.code}`}
        size={500}
        includeMargin={true}
        ref={canvasRef}
      />,
      container,
    );

    setTimeout(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `${user.name}_QRCode.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }

      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }, 100);
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
        alert('User deleted successfully.');
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      alert('An error occurred while deleting the user.');
    }
  };

  const resetPassword = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const validatePassword = (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setErrorMessage(
        'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (selectedUser) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/users/reset-pass`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedUser.id, password: newPassword }),
        });

        if (response.ok) {
          alert(`Password for ${selectedUser.name} has been reset.`);
          setIsModalOpen(false);
          setSelectedUser(null);
          setNewPassword('');
          setConfirmPassword('');
          setErrorMessage('');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to reset password.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while resetting the password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      {/* Table Display */}
      <table className="min-w-full border-collapse border-2 border-gray-500 bg-gray-300 text-sm text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-2 border-gray-500 px-4 py-2 text-left">Sr.</th>
            <th className="border-2 border-gray-500 px-4 py-2 text-left">Name</th>
            <th className="border-2 border-gray-500 px-4 py-2 text-left">Email</th>
            <th className="border-2 border-gray-500 px-4 py-2 text-left">QR Code</th>
            <th className="border-2 border-gray-500 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="border-2 border-gray-500 px-4 py-2">{index + 1}</td>
              <td className="border-2 border-gray-500 px-4 py-2">{user.name}</td>
              <td className="border-2 border-gray-500 px-4 py-2">{user.email}</td>
              <td className="border-2 border-gray-500 px-4 py-2">
                {user.qrCode?.code && (
                  <div onClick={() => downloadQRCode(user)} className="cursor-pointer">
                    <QRCodeCanvas
                      value={`https://memoria-graveapp.vercel.app/memoria-page?qrCode=${user.qrCode.code}`}
                      size={50}
                    />
                  </div>
                )}
              </td>
              <td className="border-2 border-gray-500 px-4 py-2">
                <button
                  className="rounded bg-red-500 px-3 py-1 text-sm font-medium hover:bg-red-700"
                  onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
                <button
                  className="ml-2 rounded bg-yellow-500 px-3 py-1 text-sm font-medium hover:bg-yellow-600"
                  onClick={() => resetPassword(user)}>
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Password Reset */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/3 rounded-lg bg-white p-4 text-black">
            <h2 className="text-lg font-bold">Reset Password</h2>
            <p>Set a new password for {selectedUser?.name}:</p>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded border px-2 py-1"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded border px-2 py-1"
            />
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <div className="mt-4 flex justify-end space-x-2">
              <button className="bg-gray-500 px-4 py-2 text-white" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-blue-600 px-4 py-2 text-white" onClick={handleResetPassword}>
                {isLoading ? 'Loading...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
