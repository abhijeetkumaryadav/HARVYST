import { useState } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { addMessageToSupabase } from '../utils/supabaseService';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await addMessageToSupabase({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Auto-hide success after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 lg:pt-24">
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Get in Touch</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mt-3">
            We'd love to hear from you – drop us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Reach Out to Us</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaPhone className="text-emerald-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Phone</p>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-600">+91 98765 43211 (Support)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaEnvelope className="text-emerald-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Email</p>
                  <p className="text-gray-600">hello@harvyst.in</p>
                  <p className="text-gray-600">support@harvyst.in</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-emerald-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Office</p>
                  <p className="text-gray-600">HARVYST Agri Hub,</p>
                  <p className="text-gray-600">#45, Green Valley Road, Bangalore – 560001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaClock className="text-emerald-600 text-xl mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">Working Hours</p>
                  <p className="text-gray-600">Mon – Sat: 9:00 AM – 6:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"><FaFacebook className="text-xl" /></a>
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"><FaInstagram className="text-xl" /></a>
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"><FaTwitter className="text-xl" /></a>
                <a href="#" className="bg-gray-100 p-3 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"><FaYoutube className="text-xl" /></a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>

            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                ✅ Your message has been sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}