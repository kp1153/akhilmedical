'use client'
import { useState, useEffect } from 'react'

export default function ProfitPage() {
  const [data, setData] = useState(null)
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    setLoading(true)
    const res = await fetch(`/api/profit?month=${month}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [month])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profit / Loss Report</h1>

      <div className="mb-6">
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm text-blue-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-700">₹{data.revenue}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-sm text-red-600 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-red-700">₹{data.cost}</p>
          </div>
          <div className={`rounded-xl p-5 border ${data.profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm mb-1 ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.profit >= 0 ? 'Profit' : 'Loss'}
            </p>
            <p className={`text-2xl font-bold ${data.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ₹{Math.abs(data.profit)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}