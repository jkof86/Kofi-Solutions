// Base class definition
export default class CharacterClass {
  constructor({ id, name, description, baseStats, growth }) {
    this.id = id;
    this.name = name;
    this.description = description;

    // baseStats: { hp, atk, def, agi, luck }
    this.baseStats = baseStats;

    // growth: { hp, atk, def, agi, luck }
    this.growth = growth;
  }

  getStatsAtLevel(level = 1) {
    const stats = {};
    for (const key of Object.keys(this.baseStats)) {
      stats[key] = this.baseStats[key] + this.growth[key] * (level - 1);
    }
    return stats;
  }
}
