import React, { useEffect, useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import ReactDOM from 'react-dom';

interface QR {
  id: string;
  code: string;
  used: boolean;
  userId: string;
  activationCode: string;
  user: {
    name: string;
  };
}

const DataTable = React.forwardRef((_, ref) => {
  const [qrCodes, setQrCodes] = useState<QR[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'USED' | 'UNUSED'>('ALL'); // Filter state

  // Ref for QR Code rendering
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchQrCodes = async () => {
    const response = await fetch('/api/admin/qr_code');
    const data = await response.json();
    setQrCodes(data);
  };

  useEffect(() => {
    fetchQrCodes();
  }, []);

  React.useImperativeHandle(ref, () => ({
    refresh() {
      fetchQrCodes(); // Refresh data
    },
  }));

  // Filtered QR Codes based on the selected tab
  const filteredQrCodes = qrCodes.filter((qrCode) => {
    if (filter === 'USED') return qrCode.used === true;
    if (filter === 'UNUSED') return qrCode.used === false;
    return true; // 'ALL'
  });

  const downloadQRCode = (code: string) => {
    // Create a div container for the QR code render to trigger it
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Render QRCodeCanvas to the DOM
    ReactDOM.render(
      <QRCodeCanvas
        value={`https://memoria-graveapp.vercel.app/memoria-page?qrCode=${code}`}
        size={500}
        includeMargin={true}
        ref={canvasRef} // Use the ref here
      />,
      container,
    );

    // After a small delay, fetch the rendered canvas and initiate the download
    setTimeout(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `${code}_QRCode.png`; // Name the downloaded file
        link.href = canvas.toDataURL('image/png');
        link.click(); // Trigger the download
      }

      // Cleanup temporary DOM elements
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }, 100); // Short delay to ensure the QR code is rendered before downloading
  };

  return (
    <div>
      {/* Tabs for Filtering */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setFilter('ALL')}
          className={`rounded px-4 py-2 ${filter === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
          All
        </button>
        <button
          onClick={() => setFilter('USED')}
          className={`rounded px-4 py-2 ${filter === 'USED' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
          Used
        </button>
        <button
          onClick={() => setFilter('UNUSED')}
          className={`rounded px-4 py-2 ${
            filter === 'UNUSED' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'
          }`}>
          Unused
        </button>
      </div>

      {/* Table Display */}
      <table className="min-w-full border-collapse border-2 border-gray-500 bg-gray-300 text-sm text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-2 border-gray-500 px-4 py-2 text-left">ID</th>
            <th className="border-2 border-gray-500 px-2 py-2 text-left">QR Image</th>
            <th className="border-2 border-gray-500 px-4 py-2 text-left">Code</th>
            <th className="border-2 border-gray-500 px-4 py-2 text-left">Activation Code</th>
            <th className="border-2 border-gray-500 px-4 py-2 text-left">Used</th>
            {filter !== 'UNUSED' && <th className="border-2 border-gray-500 px-4 py-2 text-left">Username</th>}
          </tr>
        </thead>
        <tbody>
          {filteredQrCodes.map((qrCode, index) => (
            <tr key={qrCode.id}>
              <td className="border-2 border-gray-500 px-4 py-2">{index + 1}</td>
              <td className="border-2 border-gray-500 px-4 py-2">
                {qrCode?.code && (
                  <div onClick={() => downloadQRCode(qrCode.code)} className="cursor-pointer">
                    <QRCodeCanvas
                      value={`https://memoria-graveapp.vercel.app/memoria-page?qrCode=${qrCode.code}`}
                      size={50}
                    />
                  </div>
                )}
              </td>
              <td className="border-2 border-gray-500 px-4 py-2">{qrCode.code}</td>
              <td className="border-2 border-gray-500 px-4 py-2">{qrCode.activationCode}</td>
              <td className="border-2 border-gray-500 px-4 py-2">{qrCode.used ? 'true' : 'false'}</td>
              {filter !== 'UNUSED' && <td className="border-2 border-gray-500 px-4 py-2">{qrCode.user?.name}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default DataTable;
