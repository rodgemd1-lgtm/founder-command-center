import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { councilAgents } from '@/lib/council'
import { businesses } from '@/lib/data'
import { cn, generateId } from '@/lib/utils'
import type { ChatMessage, CouncilAgent } from '@/types'

function AgentAvatar({ agent, selected, onClick }: { agent: CouncilAgent; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left w-full',
        selected
          ? 'bg-surface-2 border border-slate-700'
          : 'hover:bg-surface-2/50 border border-transparent'
      )}
    >
      <span className="text-xl" role="img" aria-label={agent.name}>{agent.emoji}</span>
      <div className="min-w-0">
        <p className={cn('text-sm font-medium', selected ? 'text-white' : 'text-slate-300')}>
          {agent.name}
        </p>
        <p className="text-[10px] text-slate-500 truncate">{agent.role}</p>
      </div>
    </button>
  )
}

function MessageBubble({ message, agents }: { message: ChatMessage; agents: CouncilAgent[] }) {
  const agent = message.agentId ? agents.find(a => a.id === message.agentId) : null

  return (
    <div className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
      {message.role === 'assistant' && agent && (
        <span className="text-xl mt-1">{agent.emoji}</span>
      )}
      <div className={cn(
        'max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed',
        message.role === 'user'
          ? 'bg-brand-500/10 text-brand-200 border border-brand-500/20'
          : 'bg-surface-2 text-slate-300 border border-slate-700'
      )}>
        {agent && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {agent.name} — {agent.role}
          </p>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}

export function Council() {
  const [selectedAgent, setSelectedAgent] = useState(councilAgents[0])
  const [selectedBusiness, setSelectedBusiness] = useState(businesses[0].id)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      agentId: councilAgents[0].id,
      content: `I'm ${councilAgents[0].name}, your ${councilAgents[0].role}. ${councilAgents[0].expertise.split(';')[0]}.\n\nSelect a business context and ask me anything. I'll give you straight, actionable advice — no fluff.`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleAgentSelect = (agent: CouncilAgent) => {
    setSelectedAgent(agent)
    setMessages([{
      id: generateId(),
      role: 'assistant',
      agentId: agent.id,
      content: `I'm ${agent.name}, your ${agent.role}. ${agent.expertise.split(';')[0]}.\n\nWhat do you need advice on?`,
      timestamp: new Date().toISOString(),
    }])
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    // Simulated AI response — replace with Supabase edge function call
    const biz = businesses.find(b => b.id === selectedBusiness)

    setTimeout(() => {
      const response: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        agentId: selectedAgent.id,
        content: `[${selectedAgent.name} — ${selectedAgent.role}]\n\nGood question. Here's my take given the current state of ${biz?.name || 'your portfolio'}:\n\n${selectedAgent.style}\n\nTo give you a real AI-powered response, connect your Anthropic API key:\n\n1. Create a Supabase project\n2. Add ANTHROPIC_API_KEY to Supabase secrets\n3. Deploy the council-chat edge function\n4. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env\n\nOnce connected, I'll analyze your business data in real-time and give specific, actionable advice.`,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, response])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Elite Council</h1>
        <p className="text-slate-400 mt-1">Your AI advisory board. 7 experts. Actionable advice.</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Agent Panel */}
        <div className="w-56 shrink-0 bg-surface-1 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 overflow-y-auto">
          <div className="px-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Council Members</p>
          </div>
          {councilAgents.map(agent => (
            <AgentAvatar
              key={agent.id}
              agent={agent}
              selected={selectedAgent.id === agent.id}
              onClick={() => handleAgentSelect(agent)}
            />
          ))}

          <div className="mt-auto pt-3 border-t border-slate-800 px-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Business Context</p>
            <select
              value={selectedBusiness}
              onChange={e => setSelectedBusiness(e.target.value)}
              className="w-full bg-surface-2 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-surface-1 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} agents={councilAgents} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{selectedAgent.name} is thinking...</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${selectedAgent.name} a question...`}
                className="flex-1 bg-surface-2 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-black px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              {['What should I focus on this week?', 'Where are my biggest risks?', 'How do I get to $20K MRR?'].map(chip => (
                <button
                  key={chip}
                  onClick={() => { setInput(chip); }}
                  className="text-[10px] px-2 py-1 rounded-full bg-surface-2 text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
