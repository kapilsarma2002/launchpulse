"use client";

import { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { IconUsers, IconSend } from '@tabler/icons-react';

interface BrandingData {
  name: string;
  description: string;
  logoUrl: string;
}

export default function WaitlistPage({ params }: { params: Promise<{ appName: string }> }) {
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { appName } = use(params);
  const searchParams = useSearchParams();
  const referredBy = searchParams.get('ref') || undefined;
  
  useEffect(() => {
    if (!appName) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/waitlist?appName=${appName}`);
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to fetch data');
        }
        const data = await res.json();
        setBranding(data.branding);
        setUserCount(data.userCount);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Could not load waitlist page. Please try again later.');
        }
      }
    };
    fetchData();
  }, [appName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, appName, referredBy }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Something went wrong.');
      }
      
      setIsSubmitted(true);
      setUserCount(prev => prev + 1);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !branding) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-500">{error}</div>;
  }

  if (!branding) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto text-center"
        >
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt={`${branding.name} Logo`} className="w-24 h-24 mx-auto mb-6 rounded-full shadow-lg" />
          )}
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            {branding.name}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {branding.description}
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-green-100 border border-green-200 rounded-lg"
            >
              <h2 className="text-2xl font-bold text-green-800">You're on the list!</h2>
              <p className="text-green-700 mt-2">Thanks for joining. We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 text-lg text-gray-700 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm text-gray-500">
                  <IconUsers className="mr-2" size={16} />
                  <span>{userCount.toLocaleString()} joined</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-5 py-4 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:bg-gray-400"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <IconSend className="mr-2" size={20} />
                    Join the Waitlist
                  </>
                )}
              </button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
} 