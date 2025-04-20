import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from "react-native";

type ShadowPillButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function ShadowPillButton({
  onPress,
  children,
  width = 341.86,
  height = 49.83,
  backgroundColor = "#9CE8D5",
  borderColor = "#111824",
  style,
}: ShadowPillButtonProps) {
  const borderRadius = 995.677;

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#101828",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 1.99,
          elevation: 4,
        },
        style,
      ]}
    >
      {/* Glow Border Layer */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius,
          borderColor: "#94F3DA",
          borderWidth: 3.98669,
          position: "absolute",
          zIndex: -1,
        }}
      />

      {/* Core Button Layer */}
      <View
        style={{
          width,
          height,
          borderRadius,
          backgroundColor,
          borderColor,
          borderWidth: 0.996673,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 15.95,
          paddingHorizontal: 27.91,
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </Pressable>
  );
}
