export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Akhil Medical Store</h1>
        <nav className="flex gap-4 text-sm">
          <a href="/" className="hover:text-blue-200">Home</a>
          <a href="/about" className="hover:text-blue-200">About</a>
          <a href="/services" className="hover:text-blue-200">Services</a>
          <a href="/contact" className="hover:text-blue-200">Contact</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="bg-blue-700 text-white text-center p-4 text-sm mt-10">
        <p>© 2025 Akhil Medical Store | akhilmedical.store</p>
        <p className="mt-1 text-blue-200">
          Developed by{" "}
          <a href="https://www.web-developer-kp.com" target="_blank" rel="noreferrer"
            className="text-white font-semibold underline">
            Creative Solutions
          </a>
        </p>
      </footer>
    </div>
  )
}