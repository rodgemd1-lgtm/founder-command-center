import { describe, it, expect } from 'vitest'
import { domainExperts, getExpertsByBusiness, getExpertById, getAllExperts } from '../lib/experts'
import * as fs from 'fs'
import * as path from 'path'

describe('Domain Experts', () => {
  it('should have 26 experts total', () => {
    expect(domainExperts).toHaveLength(26)
  })

  it('every expert should have a personaFile set', () => {
    for (const expert of domainExperts) {
      expect(expert.personaFile, `Expert "${expert.id}" is missing personaFile`).toBeDefined()
      expect(expert.personaFile, `Expert "${expert.id}" has empty personaFile`).not.toBe('')
    }
  })

  it('should have no duplicate expert IDs', () => {
    const ids = domainExperts.map(e => e.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })

  it('every expert should have required fields', () => {
    for (const expert of domainExperts) {
      expect(expert.id).toBeTruthy()
      expect(expert.name).toBeTruthy()
      expect(expert.role).toBeTruthy()
      expect(expert.expertise.length).toBeGreaterThan(0)
      expect(expert.style).toBeTruthy()
      expect(expert.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(expert.businesses.length).toBeGreaterThan(0)
    }
  })

  it('all persona files should exist on disk', () => {
    const intelligenceOsRoot = path.resolve(__dirname, '../../../founder-intelligence-os')
    for (const expert of domainExperts) {
      if (expert.personaFile) {
        const fullPath = path.join(intelligenceOsRoot, expert.personaFile)
        expect(fs.existsSync(fullPath), `Persona file not found: ${expert.personaFile}`).toBe(true)
      }
    }
  })

  it('getExpertsByBusiness returns correct experts', () => {
    const tfExperts = getExpertsByBusiness('transformfit')
    expect(tfExperts.length).toBeGreaterThan(0)
    for (const expert of tfExperts) {
      expect(expert.businesses).toContain('transformfit')
    }
  })

  it('getExpertById returns correct expert', () => {
    const expert = getExpertById('fitness-industry')
    expect(expert).toBeDefined()
    expect(expert?.name).toBe('Marcus Chen')
  })

  it('getExpertById returns undefined for unknown ID', () => {
    expect(getExpertById('nonexistent')).toBeUndefined()
  })

  it('getAllExperts returns all experts', () => {
    expect(getAllExperts()).toHaveLength(26)
  })

  it('Jake is the first expert', () => {
    expect(domainExperts[0].id).toBe('jake-cofounder')
    expect(domainExperts[0].name).toBe('Jake')
    expect(domainExperts[0].businesses).toHaveLength(4)
  })
})
