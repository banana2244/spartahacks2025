import { useState } from "react";
import { StyleSheet, Image, Dimensions, PixelRatio } from "react-native";
import { Link } from "expo-router";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { BlackjackTheme } from "@/assets/BlackjackTheme";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const scale = width / 320;

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function Home() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={BlackjackTheme.colors.background}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">GTO BlackJacking</ThemedText>
      </ThemedView>
      <ThemedText type="default">
        In order to play, enter the house rules below. While playing, make sure
        the dealer's cards are on the top half of the camera. After each card is
        played, select the "Next Action" button. At the end of each hand, select
        "Update Count" to update the running count. Your cards should be on the
        bottom. When the count is high, it's time to bet big. If the count is
        low, you should wait it out and bet low.
      </ThemedText>

      <ThemedTextInput label="Decks"></ThemedTextInput>

      <Link href="./game" style={styles.button}>
        <ThemedText type="link" style={styles.buttonText}>
          Start Counting!
        </ThemedText>
      </Link>
      <Link href="./info" style={styles.button}>
        <ThemedText type="link" style={styles.buttonText}>
          Learn More
        </ThemedText>
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: normalize(178),
    width: normalize(290),
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: normalize(20),
  },
  infoContainer: {
    marginVertical: normalize(20),
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: normalize(10),
    marginVertical: normalize(5),
    backgroundColor: "#f0f0f0",
    borderRadius: normalize(5),
  },
  icon: {
    fontSize: normalize(24),
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    borderRadius: normalize(5),
    textAlign: "center",
    marginTop: normalize(20),
  },
  buttonText: {
    color: "#fff",
    fontSize: normalize(16),
  },
  gradientBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
