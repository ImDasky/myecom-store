'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FAQFormProps {
  faqs: Array<{
    id: number
    question: string
    answer: string
    order: number
  }>
}

export function FAQForm({ faqs: initialFAQs }: FAQFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [faqs, setFAQs] = useState(initialFAQs)

  const addFAQ = () => {
    setFAQs([...faqs, { id: 0, question: '', answer: '', order: faqs.length }])
  }

  const updateFAQ = (index: number, field: string, value: string | number) => {
    const newFAQs = [...faqs]
    newFAQs[index] = { ...newFAQs[index], [field]: value }
    setFAQs(newFAQs)
  }

  const removeFAQ = (index: number) => {
    setFAQs(faqs.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs }),
      })

      if (res.ok) {
        router.refresh()
        alert('FAQs saved successfully!')
      } else {
        alert('Error saving FAQs')
      }
    } catch (error) {
      alert('Error saving FAQs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">FAQs</h2>
        <button
          type="button"
          onClick={addFAQ}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Question</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">Answer</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <label className="block mb-2 font-semibold">Order</label>
                  <input
                    type="number"
                    value={faq.order}
                    onChange={(e) => updateFAQ(index, 'order', parseInt(e.target.value) || 0)}
                    className="w-24 px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save FAQs'}
        </button>
      </div>
    </form>
  )
}

