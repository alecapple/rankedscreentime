import React, { useState, useEffect, useRef } from "react";
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
    ActivityIndicator,
    Animated
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Player } from "@/models/Player";
import { enterNewScreenTimeDay } from "@/lib/enterNewScreenTimeDay";
import { getSkillGroupForElo } from "@/models/SkillGroup";
import "@/models/SkillGroup";
import ZENITH_DOOMSCROLLER_1 from "@/assets/ranks/ZENITH_DOOMSCROLLER_1.svg";
import ZENITH_DOOMSCROLLER_2 from "@/assets/ranks/ZENITH_DOOMSCROLLER_2.svg";
import ZENITH_DOOMSCROLLER_3 from "@/assets/ranks/ZENITH_DOOMSCROLLER_3.svg";

const rankImages: { [key: string]: React.FC<any> } = {
    "Doom Scroller I": ZENITH_DOOMSCROLLER_1,
    "Doom Scroller II": ZENITH_DOOMSCROLLER_2,
    "Doom Scroller III": ZENITH_DOOMSCROLLER_3,
  };

const getRankImage = (rank: string) => {
   return rankImages[rank] || rankImages["Doom Scroller II"];
};
    
const backgroundImage = require("@/assets/images/HomeBg.png");
import WhiteLogo from "@/assets/logos/logoWhiteFilled.svg";
const sparkleImage = require("@/assets/images/sparkle.png");
import EnterScreentime from "@/assets/images/BUTTON_ENTERSCREENTIME.svg";
import Confirm from "@/assets/images/confirm.svg";

export default function Index() {
    const router = useRouter();
    const [screenTime, setScreenTime] = useState("---");
    const [modalVisible, setModalVisible] = useState(false);
    const [hoursInput, setHoursInput] = useState("");
    const [minutesInput, setMinutesInput] = useState("");
    const [player, setPlayer] = useState<Player | null>(null);
    const [rankLabel, setRankLabel] = useState("");
    const [rankImageKey, setRankImageKey] = useState("ZENITH_DOOMSCROLLER_2");    
    const [elo, setElo] = useState(0);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const progressAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const unsubscribe = Player.listenTo(currentUser.uid, async (updatedPlayer: Player) => {
            setPlayer(updatedPlayer);
            const playerElo = updatedPlayer.getElo();
            setElo(playerElo);
            setStreak(updatedPlayer.getStreak());

            if (updatedPlayer.getPlacementMatchesCompleted() < 3) {
                const remaining = 3 - updatedPlayer.getPlacementMatchesCompleted();
                setRankLabel(`Unranked (${remaining} remaining)`);
                setRankImageKey("ZENITH_DOOMSCROLLER_2"); // fallback image
            } else {
                const skillGroup = getSkillGroupForElo(playerElo);
                setRankLabel(skillGroup.name);
                setRankImageKey(skillGroup.name);
            }
            

            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayStr = `${yyyy}-${mm}-${dd}`;

            const todaysEntry = updatedPlayer.getScreenTimeData().find(entry => entry.day === todayStr);
            if (todaysEntry) {
                const hours = Math.floor(todaysEntry.minutes / 60);
                const minutes = todaysEntry.minutes % 60;
                setScreenTime(`${hours}h ${minutes}m`);
            } else {
                setScreenTime("Enter Time");
            }

            setLoading(false);
        });

        return () => unsubscribe?.();
    }, []);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const bounceRankImage = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      };
      
    useEffect(() => {
        const target = Math.min((elo % 100) / 100, 1);
        Animated.timing(progressAnim, {
          toValue: target,
          duration: 800,
          useNativeDriver: false,
        }).start();
      }, [elo]);
            
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.replace("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.background, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }
    const RankImage = getRankImage(rankImageKey); 
    return (
        <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.background}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <WhiteLogo width={100} height={35} />
                </View>
                <View style={styles.signOutContainer}>
                    <Pressable
                        onPress={async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        handleSignOut();
                        }}
                        style={({ pressed }) => [
                        styles.signOutButton,
                        { opacity: pressed ? 0.8 : 1 },
                        ]}
                    >
                        <Text style={styles.signOutText}>SIGN OUT</Text>
                    </Pressable>
                </View>

                <View style={styles.rankWrapper}>
                    <Pressable onPress={bounceRankImage}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <RankImage width={300} height={300} fill="#ffffff" /> 
                        </Animated.View>
                    </Pressable>
                    <Text style={styles.rankLabel}>{rankLabel}</Text>

                    <Animated.View style={styles.progressWrapper}>
                        <View style={styles.progressBarBackground}>
                            <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0%", "100%"],
                                }),
                                },
                            ]}
                            />
                        </View>
                        <Animated.View
                            style={[
                            styles.sparkle,
                            {
                                left: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "100%"],
                                }),
                            },
                            ]}
                        >
                            <Image source={sparkleImage} />
                        </Animated.View>
                        </Animated.View>

                    <Text style={styles.progressText}>NEXT RANK: {100 - Math.floor(elo % 100)} ELO NEEDED</Text>
                </View>
 
                <View style={styles.statsContainer}>
                    <View style={styles.leftStats}>
                        <Text style={styles.screenTimeValue}>{screenTime}</Text>
                        <Text style={styles.screenTimeLabel}>SCREEN TIME TODAY</Text>
                    </View>

                    <View style={styles.rightStats}>
                        <View style={styles.statRow}>
                            <Text style={styles.emoji}>🔥</Text>
                            <View style={styles.statTextBlock}>
                                <Text style={styles.statValue}>{streak} DAYS</Text>
                                <Text style={styles.statLabel}>YOUR STREAK</Text>
                            </View>
                        </View>

                        <View style={styles.statRow}>
                            <Text style={styles.emoji}>✨</Text>
                            <View style={styles.statTextBlock}>
                                <Text style={styles.statValue}>{Math.floor(elo)}</Text>
                                <Text style={styles.statLabel}>ELO</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Pressable
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setModalVisible(true);
                    }}
                >
                    <EnterScreentime />
                </Pressable>
            </ScrollView>

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
                                    setModalVisible(false);
                                    setHoursInput("");
                                    setMinutesInput("");

                                    const currentUser = auth.currentUser;
                                    if (!currentUser) return;

                                    await enterNewScreenTimeDay(currentUser.uid, (hours * 60 + minutes) / 60);
                                    await player.refresh();
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
        transform: [{ translateX: -15 }],
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
    signOutContainer: {
        position: "absolute",
        top: 83,
        right: 25,
        zIndex: 10,
      },
      
      signOutButton: {
        backgroundColor: "#1e293b",
        borderColor: "#9ce8d5",
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      
      signOutText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 14,
        letterSpacing: 1,
      },
      
      
    inputRow: {
        flexDirection: "row",
        width: "100%",
        marginTop: 8,
    },

});