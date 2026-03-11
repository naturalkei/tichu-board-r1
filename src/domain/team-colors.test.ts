import { areTeamColorsCompatible, isTeamColorSelectable } from '@/domain/team-colors'

describe('team colors', () => {
  it('rejects equal colors and known conflicting pairs', () => {
    expect(areTeamColorsCompatible('rose', 'rose')).toBe(false)
    expect(areTeamColorsCompatible('rose', 'orange')).toBe(false)
    expect(areTeamColorsCompatible('sky', 'teal')).toBe(false)
    expect(areTeamColorsCompatible('violet', 'amber')).toBe(false)
  })

  it('allows clearly separated color pairs', () => {
    expect(areTeamColorsCompatible('rose', 'sky')).toBe(true)
    expect(areTeamColorsCompatible('emerald', 'violet')).toBe(true)
    expect(areTeamColorsCompatible('amber', 'sky')).toBe(true)
  })

  it('keeps the already selected color enabled in the editor', () => {
    expect(isTeamColorSelectable('sky', 'teal', 'sky')).toBe(true)
    expect(isTeamColorSelectable('teal', 'sky', 'rose')).toBe(false)
  })
})
