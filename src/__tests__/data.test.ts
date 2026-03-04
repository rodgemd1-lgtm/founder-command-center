import { describe, it, expect } from 'vitest'
import { businesses, intelligenceItems, filterIntelligence, getBusinessBySlug } from '../lib/data'

describe('businesses', () => {
  it('has 4 businesses', () => {
    expect(businesses).toHaveLength(4)
  })

  it('each business has required fields', () => {
    for (const b of businesses) {
      expect(b.id).toBeTruthy()
      expect(b.name).toBeTruthy()
      expect(b.slug).toBeTruthy()
      expect(b.tag).toBeTruthy()
      expect(b.domains.length).toBeGreaterThan(0)
      expect(b.metrics.length).toBeGreaterThan(0)
    }
  })

  it('getBusinessBySlug finds transformfit', () => {
    const tf = getBusinessBySlug('transformfit')
    expect(tf).toBeDefined()
    expect(tf!.name).toBe('TransformFit')
  })

  it('getBusinessBySlug returns undefined for unknown', () => {
    expect(getBusinessBySlug('nonexistent')).toBeUndefined()
  })
})

describe('intelligenceItems', () => {
  it('has items', () => {
    expect(intelligenceItems.length).toBeGreaterThan(0)
  })

  it('each item has required fields', () => {
    for (const item of intelligenceItems) {
      expect(item.id).toBeTruthy()
      expect(item.name).toBeTruthy()
      expect(item.type).toMatch(/persona|framework|skill/)
      expect(item.tags.length).toBeGreaterThan(0)
      expect(item.filePath).toBeTruthy()
    }
  })

  it('has all three types', () => {
    const types = new Set(intelligenceItems.map(i => i.type))
    expect(types.has('persona')).toBe(true)
    expect(types.has('framework')).toBe(true)
    expect(types.has('skill')).toBe(true)
  })
})

describe('filterIntelligence', () => {
  it('returns all items with no filters', () => {
    const result = filterIntelligence(intelligenceItems, '', 'all', 'all')
    expect(result).toHaveLength(intelligenceItems.length)
  })

  it('filters by type', () => {
    const personas = filterIntelligence(intelligenceItems, '', 'persona', 'all')
    expect(personas.every(i => i.type === 'persona')).toBe(true)
  })

  it('filters by query', () => {
    const result = filterIntelligence(intelligenceItems, 'growth', 'all', 'all')
    expect(result.length).toBeGreaterThan(0)
    expect(result.every(i =>
      i.name.toLowerCase().includes('growth') ||
      i.description.toLowerCase().includes('growth') ||
      i.category.toLowerCase().includes('growth')
    )).toBe(true)
  })

  it('filters by tag', () => {
    const fitness = filterIntelligence(intelligenceItems, '', 'all', 'FITNESS')
    expect(fitness.every(i => i.tags.includes('FITNESS'))).toBe(true)
  })

  it('combines filters', () => {
    const result = filterIntelligence(intelligenceItems, '', 'persona', 'FITNESS')
    expect(result.every(i => i.type === 'persona' && i.tags.includes('FITNESS'))).toBe(true)
  })
})
