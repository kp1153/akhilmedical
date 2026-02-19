export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen">
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
        © 2025 Akhil Medical Store | akhilmedical.store
      </footer>
    </div>
  )
}