export class SkillGroup {
    readonly name: string;
    readonly minElo: number;
    readonly maxElo: number | null;
    readonly screenTimeRequirementHours: number;

    constructor(name: string, minElo: number, maxElo: number | null, screenTimeRequirementHours: number) {
        this.name = name;
        this.minElo = minElo;
        this.maxElo = maxElo;
        this.screenTimeRequirementHours = screenTimeRequirementHours;
    }

    containsElo(elo: number): boolean {
        if (this.maxElo === null) {
            return elo >= this.minElo;
        }
        return elo >= this.minElo && elo <= this.maxElo;
    }
}

export const SkillGroups = {
    DoomScrollerI: new SkillGroup("Doom Scroller I", 0, 99, 6),
    DoomScrollerII: new SkillGroup("Doom Scroller II", 100, 199, 5.5),
    DoomScrollerIII: new SkillGroup("Doom Scroller III", 200, 299, 5),

    ScreenagerI: new SkillGroup("Screenager I", 300, 399, 4.5),
    ScreenagerII: new SkillGroup("Screenager II", 400, 499, 4),
    ScreenagerIII: new SkillGroup("Screenager III", 500, 599, 3.5),

    GrassToucherI: new SkillGroup("Grass Toucher I", 600, 699, 3),
    GrassToucherII: new SkillGroup("Grass Toucher II", 700, 799, 2.5),
    GrassToucherIII: new SkillGroup("Grass Toucher III", 800, 899, 2),

    Guru: new SkillGroup("Guru", 900, 999, 1.5),
    Sage: new SkillGroup("Sage", 1000, null, 1),
} as const;

export function getSkillGroupForElo(elo: number): SkillGroup {
    const allGroups = Object.values(SkillGroups);
    for (const group of allGroups) {
        if (group.containsElo(elo)) {
            return group;
        }
    }
    throw new Error(`No SkillGroup found for elo: ${elo}`);
}