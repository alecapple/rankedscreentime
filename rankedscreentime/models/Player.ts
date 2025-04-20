import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, updateDoc, collection, getDocs, setDoc } from "firebase/firestore";

interface ScreenTime {
  day: string; // format "YYYY-MM-DD"
  minutes: number;
}

export class Player {
  private uid: string;
  private elo: number = 0;
  private streak: number = 0;
  private placementMatchesCompleted: number = 0;
  private screenTimeData: ScreenTime[] = [];

  constructor(uid: string) {
    this.uid = uid;
  }

  static async create(uid: string): Promise<Player> {
    const player = new Player(uid);
    await player.initialize();
    return player;
  }

  private async initialize() {
    const userRef = doc(db, "users", this.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error(`User with UID ${this.uid} does not exist.`);
    }

    const userData = userSnap.data();
    this.elo = userData.elo ?? 0;
    this.streak = userData.streak ?? 0;
    this.placementMatchesCompleted = userData.placementMatchesCompleted ?? 0;

    const screentimesRef = collection(db, "users", this.uid, "screentimes");
    const screentimesSnap = await getDocs(screentimesRef);
    this.screenTimeData = screentimesSnap.docs.map(doc => ({
      day: doc.id,
      minutes: doc.data().minutes ?? 0,
    }));
  }

  async refresh(): Promise<void> {
    await this.initialize();
  }

  async saveAll(): Promise<void> {
    const userRef = doc(db, "users", this.uid);
    await updateDoc(userRef, {
      elo: this.elo,
      streak: this.streak,
      placementMatchesCompleted: this.placementMatchesCompleted,
    });

    for (const screenTime of this.screenTimeData) {
      const screenTimeRef = doc(db, "users", this.uid, "screentimes", screenTime.day);
      await setDoc(screenTimeRef, { minutes: screenTime.minutes });
    }
  }

  // Getters
  getElo(): number {
    return this.elo;
  }

  getStreak(): number {
    return this.streak;
  }

  getPlacementMatchesCompleted(): number {
    return this.placementMatchesCompleted;
  }

  getScreenTimeData(): ScreenTime[] {
    return [...this.screenTimeData]; // return a copy
  }

  // Setters (that update Firestore)
  async updateElo(newElo: number): Promise<void> {
    const userRef = doc(db, "users", this.uid);
    await updateDoc(userRef, { elo: newElo });
    this.elo = newElo;
  }

  async updateStreak(newStreak: number): Promise<void> {
    const userRef = doc(db, "users", this.uid);
    await updateDoc(userRef, { streak: newStreak });
    this.streak = newStreak;
  }

  async updatePlacementMatchesCompleted(newCount: number): Promise<void> {
    const userRef = doc(db, "users", this.uid);
    await updateDoc(userRef, { placementMatchesCompleted: newCount });
    this.placementMatchesCompleted = newCount;
  }

  async addScreenTimeData(day: string, minutes: number): Promise<void> {
    const screenTimeRef = doc(db, "users", this.uid, "screentimes", day);
    await setDoc(screenTimeRef, { minutes });
    
    // Update local cache
    const existingIndex = this.screenTimeData.findIndex((entry) => entry.day === day);
    if (existingIndex !== -1) {
      this.screenTimeData[existingIndex].minutes = minutes;
    } else {
      this.screenTimeData.push({ day, minutes });
    }
  }
}
