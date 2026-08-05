import { useState } from 'react';
import Hero from '../components/Hero';
import { addMessageToSupabase } from '../utils/supabaseService';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await addMessageToSupabase({
        name: 'Newsletter Subscriber',
        email: email.trim(),
        subject: 'Newsletter Subscription',
        message: 'Subscribed to HARVYST newsletter.',
      });
      setSuccess(true);
      setEmail('');
      // Auto-hide success after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Banner */}
      <Hero />

      {/* Newsletter */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#2F7D32] via-[#178C63] to-[#1578A8]">
            {/* Background Image */}
            <img
              src="/newsletter-bg.jpg"
              alt=""
              className="absolute left-0 top-0 h-full w-60 object-cover opacity-25 pointer-events-none select-none"
            />

            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 px-10 py-5">
              {/* Left */}
              <div className="max-w-md text-white">
                <h2 className="text-3xl font-bold leading-tight">
                  Join the HARVYST Family
                </h2>
                <p className="mt-1 text-green-100 text-base">
                  Get expert tips, offers & updates straight to your inbox.
                </p>
              </div>

              {/* Right */}
              <div className="w-full lg:w-[500px]">
                <form onSubmit={handleSubscribe} className="flex items-center bg-white rounded-full p-1.5 shadow-lg">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent px-5 py-2.5 text-gray-700 outline-none"
                    required
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-green-600 hover:bg-green-700 transition px-7 py-2.5 text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
                {error && (
                  <p className="text-red-200 text-sm mt-2">{error}</p>
                )}
                {success && (
                  <p className="text-green-200 text-sm mt-2">
                    ✅ Subscribed successfully! Check your inbox.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}