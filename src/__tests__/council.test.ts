import { describe, it, expect } from 'vitest'
import { councilAgents, getAgentById, buildCouncilPrompt } from '../lib/council'

describe('councilAgents', () => {
  it('has 7 agents', () => {
    expect(councilAgents).toHaveLength(7)
  })

  it('each agent has required fields', () => {
    for (const agent of councilAgents) {
      expect(agent.id).toBeTruthy()
      expect(agent.name).toBeTruthy()
      expect(agent.role).toBeTruthy()
      expect(agent.emoji).toBeTruthy()
      expect(agent.expertise).toBeTruthy()
      expect(agent.style).toBeTruthy()
      expect(agent.color).toMatch(/^#/)
    }
  })

  it('all agent IDs are unique', () => {
    const ids = councilAgents.map(a => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getAgentById', () => {
  it('finds strategist', () => {
    const agent = getAgentById('strategist')
    expect(agent).toBeDefined()
    expect(agent!.name).toBe('Alex')
  })

  it('returns undefined for unknown', () => {
    expect(getAgentById('nonexistent')).toBeUndefined()
  })
})

describe('buildCouncilPrompt', () => {
  it('includes agent name and role', () => {
    const agent = councilAgents[0]
    const prompt = buildCouncilPrompt(agent, 'Test context', 'Test question')
    expect(prompt).toContain(agent.name)
    expect(prompt).toContain(agent.role)
  })

  it('includes business context', () => {
    const agent = councilAgents[0]
    const prompt = buildCouncilPrompt(agent, 'MRR is $5000', 'What next?')
    expect(prompt).toContain('MRR is $5000')
  })

  it('includes user message', () => {
    const agent = councilAgents[0]
    const prompt = buildCouncilPrompt(agent, 'ctx', 'Should I raise funding?')
    expect(prompt).toContain('Should I raise funding?')
  })
})
