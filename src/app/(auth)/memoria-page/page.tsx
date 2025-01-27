'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GenericLoading } from '@/components/GenericLoading';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qrCode = searchParams.get('qrCode') || ''; // Extract QR code from URL
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyQrCode = async () => {
      if (!qrCode) {
        setIsVerifying(false);
        return;
      }

      const response = await fetch(`/api/users/find-qr-user?qrCode=${qrCode}`);

      if (response.ok) {
        const data = await response.json();
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else {
          setIsVerifying(false); // No redirection needed, show the page content
        }
      } else {
        console.error('Error verifying QR code');
        setIsVerifying(false); // Error, but show the page content
        router.push('/'); // Error, redirect to home
      }
    };

    verifyQrCode();
  }, [qrCode, router]);

  //   if (isVerifying) {
  //     return null; // Optionally, return a loading spinner or message here
  //   }

  return <GenericLoading />;
}
