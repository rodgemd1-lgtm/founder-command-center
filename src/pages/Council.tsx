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
        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-fast text-left w-full',
        selected
          ? 'bg-accent-muted border border-accent/20'
          : 'hover:bg-surface/50 border border-transparent'
      )}
    >
      <span className="text-lg" role="img" aria-label={agent.name}>{agent.emoji}</span>
      <div className="min-w-0">
        <p className={cn('text-[13px] font-medium', selected ? 'text-accent' : 'text-label-secondary')}>
          {agent.name}
        </p>
        <p className="text-[10px] text-label-quaternary truncate">{agent.role}</p>
      </div>
    </button>
  )
}

function MessageBubble({ message, agents }: { message: ChatMessage; agents: CouncilAgent[] }) {
  const agent = message.agentId ? agents.find(a => a.id === message.agentId) : null

  return (
    <div className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
      {message.role === 'assistant' && agent && (
        <span className="text-lg mt-1">{agent.emoji}</span>
      )}
      <div className={cn(
        'max-w-[75%] rounded-xl px-4 py-3 text-[13px] leading-relaxed',
        message.role === 'user'
          ? 'bg-accent-muted text-label border border-accent/15'
          : 'glass'
      )}>
        {agent && (
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-label-quaternary mb-1.5">
            {agent.name} — {agent.role}
          </p>
        )}
        <div className="whitespace-pre-wrap text-label-secondary">{message.content}</div>
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
        content: `[${selectedAgent.name} — ${selectedAgent.role}]\n\nGood question. Here's my take given the current state of ${biz?.name || 'your portfolio'}:\n\n${selectedAgent.style}\n\nTo give you a real AI-powered response, connect your Anthropic API key in the Vault, then deploy the council-chat edge function.`,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, response])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-label tracking-tight">Elite Council</h1>
        <p className="text-[15px] text-label-secondary mt-1">Your AI advisory board. 7 experts. Actionable advice.</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Agent Panel */}
        <div className="w-56 shrink-0 glass rounded-xl p-3 flex flex-col gap-1 overflow-y-auto">
          <div className="px-2 mb-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-label-quaternary">
              Council Members
            </p>
          </div>
          {councilAgents.map(agent => (
            <AgentAvatar
              key={agent.id}
              agent={agent}
              selected={selectedAgent.id === agent.id}
              onClick={() => handleAgentSelect(agent)}
            />
          ))}

          <div className="mt-auto pt-3 border-t border-separator-subtle px-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-label-quaternary mb-2">
              Business Context
            </p>
            <select
              value={selectedBusiness}
              onChange={e => setSelectedBusiness(e.target.value)}
              className="w-full bg-surface border border-separator-subtle rounded-lg px-2 py-1.5 text-[11px] text-label focus:outline-none focus:ring-1 focus:ring-accent/30"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden">
          <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} agents={councilAgents} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-label-tertiary text-[13px]">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>{selectedAgent.name} is thinking...</span>
              </div>
            )}
          </div>

          <div className="border-t border-separator-subtle p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${selectedAgent.name} a question...`}
                className="flex-1 bg-surface border border-separator-subtle rounded-lg px-3.5 py-2.5 text-[13px] text-label placeholder:text-label-quaternary focus:outline-none focus:ring-1 focus:ring-accent/30 transition-fast"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-accent hover:bg-accent-hover disabled:opacity-30 text-canvas px-4 py-2.5 rounded-lg transition-fast"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-2.5">
              {['What should I focus on this week?', 'Where are my biggest risks?', 'How do I get to $20K MRR?'].map(chip => (
                <button
                  key={chip}
                  onClick={() => { setInput(chip); }}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-surface/60 text-label-quaternary hover:text-label-tertiary border border-separator-subtle hover:border-separator transition-fast"
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
