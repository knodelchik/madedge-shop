'use client';
import { useState } from 'react';
import { Phone, Mail, Clock, Send } from 'lucide-react';
import {
  TelegramIcon,
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
} from './icons/SocialIcons';

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
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#450a84] to-[#662987] mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-8 gap-10">
          <div className="lg:col-span-3 mt-12">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                Let's Connect
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Reach out to us for any questions or inquiries
              </p>

              <div className="space-y-6 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-all duration-300">
                    <Phone className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      Phone
                    </h3>
                    <p className="text-gray-600 text-sm">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-all duration-300">
                    <Mail className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      Email
                    </h3>
                    <p className="text-gray-600 text-sm">info@madedge.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-all duration-300">
                    <Clock className="w-4 h-4 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                      Business Hours
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Mon-Fri: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600 text-sm">
                      Sat: 9:00 AM - 4:00 PM
                    </p>
                    <p className="text-gray-600 text-sm">Sun: Closed</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  Follow Us
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Join our community and stay updated
                </p>
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href="#"
                    className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gradient-to-r from-[#450a84] to-[#662987] hover:scale-110 transition-all duration-300 group"
                  >
                    <TelegramIcon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors" />
                  </a>
                  <a
                    href="#"
                    className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gradient-to-r from-[#450a84] to-[#662987] hover:scale-110 transition-all duration-300 group"
                  >
                    <YouTubeIcon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors" />
                  </a>

                  <a
                    href="#"
                    className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gradient-to-r from-[#450a84] to-[#662987] hover:scale-110 transition-all duration-300 group"
                  >
                    <FacebookIcon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors" />
                  </a>
                  <a
                    href="#"
                    className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gradient-to-r from-[#450a84] to-[#662987] hover:scale-110 transition-all duration-300 group"
                  >
                    <InstagramIcon className="w-8 h-8 text-gray-700 group-hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-black mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions? We'd love to hear from you
              </p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-black mb-2"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-black mb-2"
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-black mb-2"
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-black mb-2"
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
