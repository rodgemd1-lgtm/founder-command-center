import { describe, it, expect } from 'vitest'
import { cn, getStatusColor, getProgressColor, generateId } from '../lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('handles conditional classes', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c')
  })
})

describe('getStatusColor', () => {
  it('returns green for on-track', () => {
    expect(getStatusColor('on-track')).toContain('emerald')
  })

  it('returns amber for at-risk', () => {
    expect(getStatusColor('at-risk')).toContain('amber')
  })

  it('returns red for blocked', () => {
    expect(getStatusColor('blocked')).toContain('red')
  })

  it('returns slate for unknown', () => {
    expect(getStatusColor('unknown')).toContain('slate')
  })
})

describe('getProgressColor', () => {
  it('returns green for high progress', () => {
    expect(getProgressColor(80)).toContain('emerald')
  })

  it('returns brand for medium progress', () => {
    expect(getProgressColor(60)).toContain('brand')
  })

  it('returns amber for low progress', () => {
    expect(getProgressColor(30)).toContain('amber')
  })

  it('returns red for very low progress', () => {
    expect(getProgressColor(10)).toContain('red')
  })
})

describe('generateId', () => {
  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })

  it('generates string ids', () => {
    expect(typeof generateId()).toBe('string')
  })
})
