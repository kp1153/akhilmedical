export default function ServicesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">💊</p>
          <h2 className="font-bold text-gray-800">All Medicines</h2>
          <p className="text-gray-500 text-sm mt-1">All types of allopathic medicines available at best prices.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">🏭</p>
          <h2 className="font-bold text-gray-800">Wholesale</h2>
          <p className="text-gray-500 text-sm mt-1">Wholesale supply available for clinics and hospitals with GST invoice.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">🩺</p>
          <h2 className="font-bold text-gray-800">Surgical Items</h2>
          <p className="text-gray-500 text-sm mt-1">Bandages, syringes, gloves and other surgical items available.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">👶</p>
          <h2 className="font-bold text-gray-800">Baby Care</h2>
          <p className="text-gray-500 text-sm mt-1">Baby food, diapers and baby care products available.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">🧴</p>
          <h2 className="font-bold text-gray-800">Cosmetics</h2>
          <p className="text-gray-500 text-sm mt-1">Skin care, hair care and health products available.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-3xl mb-2">📋</p>
          <h2 className="font-bold text-gray-800">GST Invoice</h2>
          <p className="text-gray-500 text-sm mt-1">Proper GST invoice provided for wholesale purchases.</p>
        </div>
      </div>
    </div>
  )
}