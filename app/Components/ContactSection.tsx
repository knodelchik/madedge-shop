'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Тут додати логіку відправки форми
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid lg:grid-cols-8 gap-10 ">
          {/* Ліва колонка - Contact Info (2 колонки з 5) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Reach out to us for any questions or inquiries
              </p>

              <div className="space-y-6 mb-8">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Address
                    </h3>
                    <p className="text-gray-600">123 Craftsman Lane</p>
                    <p className="text-gray-600">Precision City, PC 12345</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@madedge.com</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                    <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="bg-gray-200 mt-10 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-3" />
                <p className="font-medium">Interactive Map</p>
              </div>
            </div>
          </div>

          {/* Права колонка  */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions? We'd love to hear from you
              </p>

              <div className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
