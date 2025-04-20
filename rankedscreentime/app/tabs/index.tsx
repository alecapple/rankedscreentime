import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    Image,
    TextInput,
    Modal,
    Pressable,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import ShadowPillButton from "@/assets/login/ShadowPillButton";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Player } from "@/models/Player";
import { enterNewScreenTimeDay } from "@/lib/enterNewScreenTimeDay";
import "@/models/SkillGroup";

const backgroundImage = require("@/assets/images/HomeBg.png");
import WhiteLogo from "@/assets/logos/logoWhiteFilled.svg";
import Rank from "@/assets/ranks/ZENITH_DOOMSCROLLER_2.svg";
const sparkleImage = require("@/assets/images/sparkle.png");
import EnterScreentime from "@/assets/images/BUTTON_ENTERSCREENTIME.svg";
import Confirm from "@/assets/images/confirm.svg";
import { getSkillGroupForElo } from "@/models/SkillGroup";
export default function Index() {
    const router = useRouter();
    const [screenTime, setScreenTime] = useState("---");
    const [modalVisible, setModalVisible] = useState(false);
    const [hoursInput, setHoursInput] = useState("");
    const [minutesInput, setMinutesInput] = useState("");
    const [player, setPlayer] = useState<Player | null>(null);
    const [rankLabel, setRankLabel] = useState("");
    const [elo, setElo] = useState(0);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const fetchPlayer = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const loadedPlayer = await Player.create(currentUser.uid);
            setPlayer(loadedPlayer);

            const playerElo = loadedPlayer.getElo();

            setRankLabel(getSkillGroupForElo(playerElo).name);
            setElo(playerElo);
            setStreak(loadedPlayer.getStreak());

            if (loadedPlayer.getPlacementMatchesCompleted() < 3) {
                setRankLabel("Unranked (" + (3 - loadedPlayer.getPlacementMatchesCompleted()) + " remaining)");
            }

            // Manually get today's date
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;

            const todaysEntry = loadedPlayer.getScreenTimeData().find(entry => entry.day === todayStr);

            if (todaysEntry) {
                const hours = Math.floor(todaysEntry.minutes / 60);
                const minutes = todaysEntry.minutes % 60;
                setScreenTime(`${hours}h ${minutes}m`);
            } else {
                setScreenTime("Enter Time");
            }
        };

        fetchPlayer();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Top-left logo */}
                <View style={styles.logoContainer}>
                    <WhiteLogo width={100} height={35} />
                </View>

                {/* Rank icon */}
                <View style={styles.rankWrapper}>
                    <Rank width={300} height={300} fill="#ffffff" />
                    <Text style={styles.rankLabel}>{rankLabel}</Text>

                    {/* Progress Bar */}
                    <View style={styles.progressWrapper}>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: "65%" }]} />
                        </View>

                        {/* Sparkle icon */}
                        <View style={[styles.sparkle, { left: "65%" }]}>
                            <Image source={sparkleImage} />
                        </View>
                    </View>

                    <Text style={styles.progressText}>NEXT RANK: {100 - Math.floor(elo % 100)} ELO NEEDED</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    {/* Left Column: Screen Time */}
                    <View style={styles.leftStats}>
                        <Text style={styles.screenTimeValue}>{screenTime}</Text>
                        <Text style={styles.screenTimeLabel}>SCREEN TIME TODAY</Text>
                    </View>

                    {/* Right Column: Streak + ELO */}
                    <View style={styles.rightStats}>
                        {/* Streak */}
                        <View style={styles.statRow}>
                            <Text style={styles.emoji}>🔥</Text>
                            <View style={styles.statTextBlock}>
                                <Text style={styles.statValue}>{streak} DAYS</Text>
                                <Text style={styles.statLabel}>YOUR STREAK</Text>
                            </View>
                        </View>

                        {/* ELO */}
                        <View style={styles.statRow}>
                            <Text style={styles.emoji}>✨</Text>
                            <View style={styles.statTextBlock}>
                                <Text style={styles.statValue}>{Math.floor(elo)}</Text>
                                <Text style={styles.statLabel}>ELO</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Enter Screen Time Button */}
                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setModalVisible(true);
                    }}
                >
                    <EnterScreentime />
                </Pressable>

                {/* Optional: Sign Out Button */}
                {/* <ShadowPillButton
              onPress={handleSignOut}
              backgroundColor="#35466f"
              borderColor="#9ce8d5"
              width={200}
              height={50}
              style={{ marginTop: 40 }}
            >
              <Text style={styles.signOutText}>SIGN OUT</Text>
            </ShadowPillButton> */}
            </ScrollView>

            {/* Modal for Updating Screen Time */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Screen Time</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginRight: 8 }]}
                                placeholder="Hours"
                                placeholderTextColor="#888"
                                value={hoursInput}
                                onChangeText={setHoursInput}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Minutes"
                                placeholderTextColor="#888"
                                value={minutesInput}
                                onChangeText={setMinutesInput}
                                keyboardType="numeric"
                            />
                        </View>
                        <Pressable
                            onPress={async () => {
                                const hours = parseInt(hoursInput) || 0;
                                const minutes = parseInt(minutesInput) || 0;

                                if (hours === 0 && minutes === 0) {
                                    alert("Please enter your screen time.");
                                    return;
                                }

                                if (hours > 24) {
                                    alert("Hours can't exceed 24.");
                                    return;
                                }

                                if (minutes > 59) {
                                    alert("Minutes can't exceed 59.");
                                    return;
                                }

                                if (!player) {
                                    alert("Player not loaded.");
                                    return;
                                }

                                try {

                                    // Close modal and reset
                                    setModalVisible(false);
                                    setHoursInput("");
                                    setMinutesInput("");

                                    const currentUser = auth.currentUser;
                                    if (!currentUser) return;

                                    await enterNewScreenTimeDay(currentUser.uid, (hours * 60 + minutes) / 60);

                                    await player.refresh();

                                    // Refresh UI
                                    const playerElo = player.getElo();
                                    setRankLabel(getSkillGroupForElo(playerElo).name);
                                    setElo(playerElo);
                                    setStreak(player.getStreak());
                                    setScreenTime(`${hours}h ${minutes}m`);

                                    if (player.getPlacementMatchesCompleted() < 3) {
                                        setRankLabel("Unranked (" + (3 - player.getPlacementMatchesCompleted()) + " remaining)");
                                    }

                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                } catch (error) {
                                    console.error("Error entering new screen time:", error);
                                    alert("Failed to submit screen time.");
                                }
                            }}

                            disabled={!hoursInput.trim() && !minutesInput.trim()}
                            style={{
                                marginTop: 20,
                                opacity: hoursInput.trim() || minutesInput.trim() ? 1 : 0.5,
                            }}
                        >
                            <Confirm />
                        </Pressable>

                    </View>
                </View>
            </Modal>

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
    rankWrapper: {
        alignItems: "center",
        marginTop: 100,
    },
    rankLabel: {
        fontSize: 20,
        fontWeight: "600",
        color: "#ffffff",
        marginTop: 12,
    },
    progressWrapper: {
        width: 180,
        height: 40,
        justifyContent: "center",
    },
    progressBarBackground: {
        width: "100%",
        height: 12,
        backgroundColor: "#334155",
        marginTop: 16,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#07A77F",
    },
    sparkle: {
        position: "absolute",
        bottom: -12,
        transform: [{ translateX: -20 }],
    },
    progressText: {
        color: "#cbd5e1",
        marginTop: 20,
        fontSize: 12,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30,
        width: "100%",
        paddingHorizontal: 10,
        gap: 24,
    },
    leftStats: {
        flex: 1,
        alignItems: "center",
    },
    screenTimeValue: {
        color: "#fff",
        fontSize: 40,
        fontWeight: "bold",
    },
    screenTimeLabel: {
        color: "#cbd5e1",
        fontSize: 14,
        marginTop: 4,
    },
    rightStats: {
        flex: 1,
        justifyContent: "center",
        gap: 16,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    emoji: {
        fontSize: 36,
        color: "#fff",
        width: 36,
        textAlign: "center",
    },
    statTextBlock: {
        justifyContent: "center",
    },
    statValue: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
    },
    statLabel: {
        color: "#cbd5e1",
        fontSize: 12,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        // backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1e293b",
        padding: 24,
        borderRadius: 16,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#334155",
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#fff",
    },
    signOutText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#ffffff",
    },
    inputRow: {
        flexDirection: "row",
        width: "100%",
        marginTop: 8,
    },

});