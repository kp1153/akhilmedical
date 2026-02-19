import Link from "next/link"

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-blue-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">Akhil Medical Store</h1>
        <p className="text-blue-200 text-lg mb-6">आपकी सेहत, हमारी जिम्मेदारी</p>
        <a href="https://wa.me/918400017027" target="_blank" rel="noreferrer"
          className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold text-lg">
          💬 WhatsApp करें
        </a>
      </section>

      {/* Info */}
      <section className="max-w-2xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">💊</p>
          <h2 className="font-bold text-gray-800">सभी दवाइयां</h2>
          <p className="text-gray-500 text-sm mt-1">Retail और Wholesale दोनों उपलब्ध</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">🕗</p>
          <h2 className="font-bold text-gray-800">समय</h2>
          <p className="text-gray-500 text-sm mt-1">सुबह 8 बजे से रात 9 बजे तक</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">📍</p>
          <h2 className="font-bold text-gray-800">पता</h2>
          <p className="text-gray-500 text-sm mt-1">Hathiyawa Chauraha, Siddharth Nagar</p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-10">
        <a href="tel:8400017027"
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg">
          📞 Call करें: 8400017027
        </a>
      </section>
    </div>
  )
}