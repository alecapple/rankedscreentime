import { Tabs } from "expo-router";
import { Pressable, View, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

import HomeIcon from "@/assets/tabs/HomePage_hometab.svg";
import ChallengeIcon from "@/assets/tabs/HomePage_challengestab.svg";

export default function TabLayout() {
  return (
    <View style={styles.wrapper}>

      {/* Tabs */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            position: "absolute",
          },
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={(e) => {
                Haptics.selectionAsync();
                props.onPress?.(e);
              }}
            >
              {props.children}
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <HomeIcon width={70} height={60} fill={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="challenge"
          options={{
            title: "Challenge",
            tabBarIcon: ({ color }) => (
              <ChallengeIcon width={70} height={60} fill={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  logoContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 999,
  },
});
