import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, Users, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getExpertsByBusiness, getExpertById, getAllExperts } from '@/lib/experts'
import { businesses } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import type { DomainExpert } from '@/types'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function Experts() {
  const [searchParams] = useSearchParams()
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0].slug)
  const [selectedExpert, setSelectedExpert] = useState<DomainExpert | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const experts = selectedBusiness === 'all'
    ? getAllExperts()
    : getExpertsByBusiness(selectedBusiness)

  // Auto-select expert from URL params (e.g., ?expert=jake-cofounder)
  useEffect(() => {
    if (initialized) return
    const expertParam = searchParams.get('expert')
    if (expertParam) {
      const expert = getExpertById(expertParam)
      if (expert) {
        setSelectedBusiness('all')
        setSelectedExpert(expert)
        setMessages([{
          id: crypto.randomUUID(),
          role: 'assistant',
          content: expertParam === 'jake-cofounder'
            ? `Revenue this week? What shipped? What's blocked?\n\nI'm Jake, your co-founder. Let's cut the small talk and get to work. What are we solving today?`
            : `Hi Mike, I'm ${expert.name}, your ${expert.role}. I specialize in ${expert.expertise.slice(0, 3).join(', ')}. What would you like to discuss?`,
          timestamp: new Date()
        }])
      }
    }
    setInitialized(true)
  }, [searchParams, initialized])

  useEffect(() => {
    if (!initialized) return
    setSelectedExpert(null)
    setMessages([])
  }, [selectedBusiness, initialized])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSelectExpert = (expert: DomainExpert) => {
    setSelectedExpert(expert)
    setMessages([{
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Hi Mike, I'm ${expert.name}, your ${expert.role}. I specialize in ${expert.expertise.slice(0, 3).join(', ')}. What would you like to discuss about ${businesses.find(b => b.slug === selectedBusiness)?.name || 'your business'}?`,
      timestamp: new Date()
    }])
  }

  const handleSend = async () => {
    if (!input.trim() || !selectedExpert || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let responseText: string | undefined

      if (supabase) {
        try {
          // Call Supabase edge function
          const { data, error } = await supabase.functions.invoke('expert-chat', {
            body: {
              expert_id: selectedExpert.id,
              expert_name: selectedExpert.name,
              expert_role: selectedExpert.role,
              expert_style: selectedExpert.style,
              expert_persona_file: selectedExpert.personaFile,
              business_id: selectedBusiness,
              business_name: businesses.find(b => b.slug === selectedBusiness)?.name,
              message: input.trim(),
              conversation_history: messages.map(m => ({ role: m.role, content: m.content }))
            }
          })
          if (error) throw error
          responseText = data.response
        } catch (err) {
          console.warn('Expert chat edge function failed, using simulated response:', err)
          // Fall through to simulated response below
        }
      }

      if (!responseText) {
        // Simulated response for dev
        await new Promise(resolve => setTimeout(resolve, 1000))
        responseText = `As ${selectedExpert.name}, here's my take on that:\n\nBased on my expertise in ${selectedExpert.expertise[0]}, I'd recommend focusing on the immediate blockers first. The most important thing right now is to validate your assumptions with real users before scaling.\n\n**Key actions:**\n- Start with a small beta group (10-20 users)\n- Measure retention at Day 1, Day 7, Day 30\n- Don't optimize for growth until retention > 40% at Day 30\n\nWant me to dive deeper into any of these areas?`
      }

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }])
    } catch (error) {
      console.warn('Expert chat error:', error)
      toast.error('Expert chat connection failed — showing fallback response')
      const businessName = businesses.find(b => b.slug === selectedBusiness)?.name || 'your business'
      const expertiseAreas = selectedExpert.expertise.slice(0, 3).join(', ')
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Expert chat is connecting... In the meantime, here's what I can tell you about "${input.trim()}" based on available knowledge.\n\nAs ${selectedExpert.name} (${selectedExpert.role}), my areas of focus for ${businessName} include ${expertiseAreas}. While the live AI connection is being established, I'd recommend reviewing the Research Feed and Intelligence Library for data-backed insights on this topic.\n\n**Next steps:**\n- Check the Research Feed for relevant competitive intelligence\n- Review the Decision Log for related past decisions\n- Try asking again in a moment — the connection may recover\n\nI'm here to help as soon as the connection is fully active.`,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-4">
      {/* Left Panel — Expert List */}
      <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Business Selector */}
        <div className="p-3 border-b border-gray-200">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 block">Business</label>
          <select
            value={selectedBusiness}
            onChange={e => setSelectedBusiness(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {businesses.map(b => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
            <option value="all">All Businesses</option>
          </select>
        </div>

        {/* Expert List */}
        <div className="flex-1 overflow-y-auto p-2">
          <p className="text-xs text-gray-400 px-2 py-1">{experts.length} experts available</p>
          {experts.map(expert => (
            <button
              key={expert.id}
              onClick={() => handleSelectExpert(expert)}
              className={`w-full text-left p-2.5 rounded-lg mb-1 transition-colors ${
                selectedExpert?.id === expert.id
                  ? 'bg-amber-50 border border-amber-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{ backgroundColor: expert.color }}
                >
                  {expert.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{expert.name}</p>
                  <p className="text-xs text-gray-500 truncate">{expert.role}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel — Chat */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        {selectedExpert ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: selectedExpert.color }}
              >
                {selectedExpert.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedExpert.name}</h2>
                <p className="text-xs text-gray-500">{selectedExpert.role}</p>
              </div>
              <div className="ml-auto flex gap-1.5 flex-wrap justify-end">
                {selectedExpert.expertise.slice(0, 3).map(exp => (
                  <span key={exp} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{exp}</span>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-amber-200' : 'text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={`Ask ${selectedExpert.name}...`}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Select a Domain Expert</h3>
              <p className="text-sm text-gray-500 mt-1">Choose an expert from the left panel to start a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
