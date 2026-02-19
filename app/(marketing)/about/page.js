export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">About Us</h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div>
          <h2 className="font-bold text-gray-800 text-lg">Akhil Medical Store</h2>
          <p className="text-gray-600 mt-1">
            Akhil Medical Store is a trusted medical shop serving the people of Siddharth Nagar
            and surrounding areas. We provide all types of medicines at affordable prices.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 text-lg">Owner</h2>
          <p className="text-gray-600 mt-1">Akhilesh Yadav</p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 text-lg">Location</h2>
          <p className="text-gray-600 mt-1">Hathiyawa Chauraha, Siddharth Nagar - 272189, Uttar Pradesh</p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 text-lg">Timing</h2>
          <p className="text-gray-600 mt-1">Monday - Sunday: 8:00 AM to 9:00 PM</p>
        </div>

        <div>
          <h2 className="font-bold text-gray-800 text-lg">Contact</h2>
          <p className="text-gray-600 mt-1">Phone: 8400017027</p>
          <p className="text-gray-600">Email: akhileshyadav72513@gmail.com</p>
          <p className="text-gray-600">Web: akhilmedical.store</p>
        </div>
      </div>
    </div>
  )
}