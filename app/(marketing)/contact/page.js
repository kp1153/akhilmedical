export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Contact Us</h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-5">
        <div className="flex items-start gap-4">
          <span className="text-3xl">📍</span>
          <div>
            <h2 className="font-bold text-gray-800">Address</h2>
            <p className="text-gray-600">Hathiyawa Chauraha, Siddharth Nagar - 272189, Uttar Pradesh</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-3xl">📞</span>
          <div>
            <h2 className="font-bold text-gray-800">Phone</h2>
            <a href="tel:8400017027" className="text-blue-600 font-semibold">8400017027</a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-3xl">💬</span>
          <div>
            <h2 className="font-bold text-gray-800">WhatsApp</h2>
            <a href="https://wa.me/918400017027" target="_blank" rel="noreferrer"
              className="text-green-600 font-semibold">Chat on WhatsApp</a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-3xl">📧</span>
          <div>
            <h2 className="font-bold text-gray-800">Email</h2>
            <a href="mailto:akhileshyadav72513@gmail.com" className="text-blue-600">akhileshyadav72513@gmail.com</a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="text-3xl">🕗</span>
          <div>
            <h2 className="font-bold text-gray-800">Timing</h2>
            <p className="text-gray-600">Monday - Sunday: 8:00 AM to 9:00 PM</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a href="https://maps.google.com/?q=Hathiyawa+Chauraha+Siddharth+Nagar+272189+Uttar+Pradesh"
          target="_blank" rel="noreferrer"
          className="block bg-blue-600 text-white text-center rounded-2xl p-4 font-semibold">
          📍 View on Google Maps
        </a>
      </div>

      <div className="mt-3">
        <a href="https://wa.me/918400017027" target="_blank" rel="noreferrer"
          className="block bg-green-500 text-white text-center rounded-2xl p-4 font-semibold">
          💬 WhatsApp करें
        </a>
      </div>
    </div>
  )
}