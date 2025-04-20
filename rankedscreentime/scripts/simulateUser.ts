// scripts/simulateUser.ts
import { simulateUserMatches } from "@/scripts/simulateUserMatches"; // or correct path
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { app } from "@/firebase/firebaseConfig"; // adjust this to your project's Firebase config

import "@/firebase/firebaseConfig";

async function main() {
  
  // (Optional) initialize Firestore if needed separately
  // const firestore = getFirestore(app);

  const userId = process.argv[2]; // pass userId as a command line arg
  if (!userId) {
    console.error("Error: Please provide a userId.");
    process.exit(1);
  }

  console.log(`Running screentime simulation for userId=${userId}...`);
  await simulateUserMatches(userId);

  console.log("✅ Done!");
}

main().catch(err => {
  console.error("❌ Simulation failed:", err);
  process.exit(1);
});
