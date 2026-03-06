import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { createCustomerIntel } from '@/lib/customer-intel'

const PRODUCT_INFO: Record<string, { name: string; tagline: string; color: string }> = {
  transformfit: {
    name: 'TransformFit',
    tagline: 'AI-powered fitness that adapts to you',
    color: '#F59E0B',
  },
  'viral-architect': {
    name: 'Viral Architect Hub',
    tagline: 'Autonomous Instagram content creation',
    color: '#8B5CF6',
  },
  'intelligence-engine': {
    name: 'Intelligence Engine',
    tagline: 'Cross-company competitive intelligence',
    color: '#3B82F6',
  },
  'automotive-os': {
    name: 'Automotive Repair OS',
    tagline: 'AI-powered shop management',
    color: '#78716C',
  },
}

export function Waitlist() {
  const { product } = useParams<{ product: string }>()
  const info = product ? PRODUCT_INFO[product] : undefined
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    source: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !product) return
    setIsSubmitting(true)
    try {
      await createCustomerIntel({
        business_id: product,
        email: formData.email,
        name: formData.name || undefined,
        source: formData.source || 'waitlist',
        segment: 'waitlist',
        notes: `Waitlist signup from /waitlist/${product}`,
      })
      setSubmitted(true)
    } catch (err) {
      console.warn('Failed to submit waitlist:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">Product not found</p>
          <Link to="/" className="text-sm text-amber-600 hover:text-amber-700 underline mt-2 inline-block">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="max-w-md mx-auto text-center px-6">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: info.color }} />
          <h1 className="text-2xl font-semibold text-gray-900">You're on the list</h1>
          <p className="text-gray-500 mt-2">
            We'll notify you when {info.name} is ready for beta access. Thanks for your interest.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: info.color }}
          >
            {info.name.charAt(0)}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{info.name}</h1>
          <p className="text-gray-500 mt-1">{info.tagline}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-medium text-gray-900">Join the waitlist</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (required)</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
            <select
              value={formData.source}
              onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
            >
              <option value="">Select...</option>
              <option value="twitter">Twitter/X</option>
              <option value="instagram">Instagram</option>
              <option value="reddit">Reddit</option>
              <option value="friend">Friend/referral</option>
              <option value="search">Google search</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.email}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: info.color }}
          >
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          Built by FounderOS. No spam, ever.
        </p>
      </div>
    </div>
  )
}
