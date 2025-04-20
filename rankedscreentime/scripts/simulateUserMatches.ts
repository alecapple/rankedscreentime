import { enterNewScreenTimeDay } from "@/lib/enterNewScreenTimeDay";

// Utility to pause between Firestore transactions (optional but realistic)
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate a fake daily screentime (simulate good/bad days)
function generateRandomHours(baseHours: number, variance: number = 1.5): number {
  const randomVariance = (Math.random() * 2 - 1) * variance; // -variance to +variance
  return Math.max(0, Math.min(24, baseHours + randomVariance));
}

// Simulate a user flow
export async function simulateUserMatches(userId: string) {
  console.log(`Starting simulation for user ${userId}...`);

  // --- Placements (3 days) ---
  console.log("Placement matchesss:");

  const startDate = new Date();
  for (let day = 1; day <= 3; day++) {
    // Increment the start date by the current day that we're on
    const simulatedDate = new Date(startDate);
    simulatedDate.setDate(startDate.getDate() + day);

    const hours = generateRandomHours(5); // base 5 hours screentime for placements
    console.log(`Placement Day ${day}: ${hours.toFixed(2)} hours`);
    await enterNewScreenTimeDay(userId, hours, simulatedDate);
    await delay(500); // Small delay between submissions
  }

  console.log("Placements done!");

  // --- Ranked matches (5 days) ---
  console.log("Ranked matches:");
  for (let day = 1; day <= 5; day++) {
    const hours = generateRandomHours(4); // base 4 hours screentime, now trying to do better
    console.log(`Ranked Day ${day}: ${hours.toFixed(2)} hours`);
    await enterNewScreenTimeDay(userId, hours);
    await delay(500); // Small delay
  }

  console.log("Simulation complete!");
}