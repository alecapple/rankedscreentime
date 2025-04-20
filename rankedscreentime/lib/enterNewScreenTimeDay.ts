import { db } from "@/firebase/firebaseConfig"; // Your firebase app
import { Timestamp } from "firebase/firestore";
import { getEloFromScreenTime, getSkillGroupForElo, SkillGroup } from "@/models/SkillGroup";
import { Player } from "@/models/Player";

export async function enterNewScreenTimeDay(userId: string, hours: number, date?: Date): Promise<void> {
  console.log("enterNewScreenTimeDay");

  if (hours < 0 || hours > 24) {
    throw new Error("Invalid hours: must be between 0 and 24");
  }

  const minutes = Math.round(hours * 60);
  const entryDate = date ?? new Date();
  const dateString = entryDate.toISOString().split('T')[0];

  // Create Player instance
  const player = await Player.create(userId);

  // Add today's screentime
  await player.addScreenTimeData(dateString, minutes);

  // Update placement matches count
  const newPlacementCount = player.getPlacementMatchesCompleted() + 1;
  await player.updatePlacementMatchesCompleted(newPlacementCount);

  // After placement matches completed
  if (newPlacementCount === 3) {
    const screenTimeMinutes: number[] = player.getScreenTimeData().map(entry => entry.minutes);

    // if (screenTimeMinutes.length < 3) {
    //   throw new Error(`Expected 3 placement matches, got ${screenTimeMinutes.length}`);
    // }

    // Calculate starting Elo
    const eloValues = screenTimeMinutes
      .slice(0, 3)
      .map(minutes => getEloFromScreenTime(minutes / 60));

    const startingElo = Math.round(
      eloValues.reduce((a, b) => a + b, 0) / eloValues.length
    );

    console.log("Placed player at " + getSkillGroupForElo(startingElo).name + " " + startingElo);

    // Update elo and reset streak
    await player.updateElo(startingElo);
    await player.updateStreak(0);

    return;
  }

  if (newPlacementCount > 3) {  
    const playerElo = player.getElo();
    const playerSkillGroup: SkillGroup = getSkillGroupForElo(playerElo);
    const screenTimeHours = minutes / 60;

    const eloDifference = getEloFromScreenTime(screenTimeHours) - playerSkillGroup.minElo;

    let streakMultiplier = 1;
    if (eloDifference > 0) {
        streakMultiplier = (player.getStreak() + 5.0) / 5.0;
        player.updateStreak(player.getStreak() + 1);
    } else if (eloDifference < 0) {
        player.updateStreak(0);
    }

    const baseElo = 10;
    const eloOffset = baseElo * (eloDifference / 15.0) * streakMultiplier;

    console.log("Elo offset: " + eloOffset);

    player.updateElo(playerElo + eloOffset);
  }
}
