import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import WhiteLogo from "@/assets/logos/logoWhite.svg";
import { auth, db } from "@/firebase/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Player } from "@/models/Player";

const backgroundImage = require("@/assets/images/ChallengeBg.png");

export default function Challenge() {
  const [screenTime, setScreenTime] = useState("---");
  const [leaderboard, setLeaderboard] = useState<
    { rank: number; username: string; elo: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerAndLeaderboard = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const loadedPlayer = await Player.create(currentUser.uid);
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;

      const todaysEntry = loadedPlayer
        .getScreenTimeData()
        .find((entry) => entry.day === todayStr);

      if (todaysEntry) {
        const hours = Math.floor(todaysEntry.minutes / 60);
        const minutes = todaysEntry.minutes % 60;
        setScreenTime(`${hours}h ${minutes}m`);
      } else {
        setScreenTime("Enter Time");
      }

      const q = query(collection(db, "users"), orderBy("elo", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const results = snapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            rank: index + 1,
            username: data.username || "unknown",
            elo: Math.floor(data.elo || 0),
          };
        });

        setLeaderboard(results);
        setLoading(false);
      });

      return unsubscribe;
    };

    const unsubscribePromise = fetchPlayerAndLeaderboard();

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === "function") unsubscribe();
      });
    };
  }, []);

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top-left logo */}
        <View style={styles.logoContainer}>
          <WhiteLogo width={100} height={35} />
        </View>

        {/* Top-right screen time display */}
        {/* <View style={styles.screenTimeContainer}>
          <Text style={styles.screenTimeValue}>{screenTime}</Text>
          <Text style={styles.screenTimeLabel}>YOUR SCREEN TIME TODAY</Text>
        </View> */}

        {/* Leaderboard */}
        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>LEADERBOARD</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 40 }} />
          ) : (
            <>
              <View style={styles.leaderboardHeader}>
                <Text style={[styles.headerCol, { flex: 1, textAlign: "center" }]}>RANK</Text>
                <Text style={[styles.headerCol, { flex: 1, textAlign: "center" }]}>ELO</Text>
                <Text style={[styles.headerCol, { flex: 2, textAlign: "right" }]}>
                  USER
                </Text>
              </View>

              {leaderboard.map((entry) => (
                <View key={entry.rank} style={styles.leaderboardRow}>
                  <Text style={[styles.leaderboardCell, { flex: 1, textAlign: "center" }]}>
                    {entry.rank}
                  </Text>
                  <Text style={[styles.leaderboardCell, { flex: 1, textAlign: "center" }]}>
                    {entry.elo}
                  </Text>
                  <Text
                    style={[
                      styles.leaderboardCell,
                      { flex: 2, textAlign: "right" },
                    ]}
                  >
                    {entry.username}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    position: "absolute",
    top: 83,
    left: 25,
  },
  screenTimeContainer: {
    position: "absolute",
    top: 83,
    right: 25,
    alignItems: "flex-end",
  },
  screenTimeValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  screenTimeLabel: {
    color: "#cbd5e1",
    fontSize: 9,
    marginTop: 2,
  },
  leaderboardContainer: {
    marginTop: 160,
    width: "100%",
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "left",
  },
  leaderboardHeader: {
    flexDirection: "row",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#475569",
    paddingBottom: 6,
    marginBottom: 6,
  },
  headerCol: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "600",
  },
  leaderboardRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  leaderboardCell: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
});
