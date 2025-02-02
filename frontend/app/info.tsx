import { useState } from "react";
import { StyleSheet, Image, Dimensions, PixelRatio } from "react-native";
import { Link } from "expo-router";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { BlackjackTheme } from "@/assets/BlackjackTheme";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
const scale = width / 320;

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default function Info() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={BlackjackTheme.colors.background}
    >
      {/* First Heading: How to play BlackJack */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">How to play BlackJack</ThemedText>
      </ThemedView>

      {/* Rules List */}
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="default">
          BlackJack is a popular card game played with one or more decks of
          cards. The goal is to beat the dealer by getting a hand value as close
          to 21 as possible without exceeding it. Here are the basic rules:
        </ThemedText>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            1. The game is usually played with 1 to 8 decks of cards.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            2. Players are dealt two cards, and the dealer is also dealt two
            cards (one face up, one face down).
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            3. Aces can be worth 1 or 11 points, face cards (King, Queen, Jack)
            are worth 10 points, and numbered cards are worth their face value.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            4. Players can choose to "hit" (get another card) or "stand" (keep
            their current hand).
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            5. If a player's hand exceeds 21 points, they "bust" and lose the
            round.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            6. After all players have finished their turns, the dealer reveals
            their face-down card and must hit until their hand totals 17 or more
            points.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            7. If the dealer busts, all remaining players win the round.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.infoBox}>
          <ThemedText type="default">
            8. If the player’s hand is closer to 21 than the dealer’s hand, the
            player wins. If the dealer’s hand is closer to 21, the dealer wins.
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Second Heading: What is Card Counting */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">What is Card Counting?</ThemedText>
      </ThemedView>

      {/* Card Counting Explanation */}
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="default">
          Card counting is a strategy used in Blackjack to keep track of the
          cards that have been dealt. The main goal is to gain an advantage by
          knowing which cards remain in the deck. By doing so, players can
          adjust their bets and decisions based on the likelihood of certain
          cards being dealt.
        </ThemedText>
        <ThemedText type="default">
          The most common card counting system assigns a value to each card as
          it’s dealt. High cards (10s, Jacks, Queens, Kings, Aces) are typically
          assigned a negative value, and low cards (2-6) are given a positive
          value. Cards in the middle (7, 8, 9) are usually considered neutral.
          As the game progresses, players keep a "running count" of the values
          to determine if the remaining deck is rich in high cards or low cards.
          When the count is positive, it indicates a higher probability of high
          cards being dealt, which is favorable for the player.
        </ThemedText>
      </ThemedView>

      {/* Home Button */}
      <Link href="./" style={styles.button}>
        <ThemedText type="link" style={styles.buttonText}>
          Home
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
});
