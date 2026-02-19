'use client'

export default function LogoutButton() {
  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-600 transition w-full text-left"
    >
      <span>🚪</span><span>Logout</span>
    </button>
  )
}