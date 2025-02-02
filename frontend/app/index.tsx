import { useState } from "react";
import { StyleSheet, Image, Dimensions, PixelRatio } from "react-native";
import { Link } from "expo-router";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { BlackjackTheme } from "@/assets/BlackjackTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Button, TextInput } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = width / 320;

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const ACTION_URL = "https://aee0-35-23-172-182.ngrok-free.app/";

export default function Home(setGameState: any, gameState: any) {
  const [deckCount, setDeckCount] = useState(1);

  async function onClick() {
    console.log("Sending!");
    let response = await fetch(ACTION_URL, {
      method: "GET",
    });
    console.log("Response: ", response);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={BlackjackTheme.colors.background}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.textWithShadow}>
          GTO BlackJacking
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="default" style={styles.infoText}>
          In order to play, enter the house rules below. While playing, make
          sure the dealer's cards are on the top half of the camera. After each
          card is played, select the "Next Action" button. At the end of each
          hand, select "Update Count" to update the running count. Your cards
          should be on the bottom. When the count is high, it's time to bet big.
          If the count is low, you should wait it out and bet low.
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ justifyContent: "center" }}>
        <ThemedText type="default" style={styles.labelText}>
          Decks
        </ThemedText>
        <TextInput
          style={styles.textInput}
          onChangeText={(value) => {
            setDeckCount(Number(value));
          }}
          value={String(deckCount)}
          keyboardType="numeric"
          textAlign={"center"}
        />
      </ThemedView>
      <Link href={{ pathname: `./game/${deckCount}` }} style={styles.button}>
        <ThemedText type="link" style={styles.buttonText}>
          Start Counting!
        </ThemedText>
      </Link>
      <Link href="./info" style={styles.button}>
        <ThemedText type="link" style={styles.buttonText}>
          Learn More
        </ThemedText>
      </Link>

      <Button title="hi" onPress={onClick} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  infoText: {
    fontSize: normalize(12),
    textAlign: "center",
  },
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
    padding: normalize(5),
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    borderRadius: normalize(5),
    borderColor: "#f0f0f0",
    borderWidth: 1,
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
  vignette: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textWithShadow: {
    textShadowColor: "#000", // Shadow color (black)
    textShadowOffset: { width: 3, height: 3 }, // Make the shadow more pronounced (right and down)
    textShadowRadius: 10, // Increase blur radius to make the shadow larger and softer
    padding: normalize(10),
  },
  container: {
    flex: 1,
    gap: 2,
  },
  labelText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
  textInput: {
    fontSize: 24,
    lineHeight: 24,
    padding: 12,
    textAlignVertical: "center",
    color: "white",
    borderColor: BlackjackTheme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
  },
});
