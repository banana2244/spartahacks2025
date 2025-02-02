import { BlackjackTheme } from "@/assets/BlackjackTheme";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

type GameState = {
  cardsLeft: number;
  currentCount: number;
  dealerCards: number;
  playerCards: number;
};

export default function Game(numberOfDecks: number) {
  const [permission, requestPermission] = useCameraPermissions();
  const [gameState, setGameState] = useState({
    cardsLeft: numberOfDecks * 52,
    currentCount: 0,
    dealerCards: 0,
    playerCards: 0,
  });

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Section */}
      <View style={styles.topHalf}>
        <CameraView style={styles.camera} facing="back">
          {/* Dotted line separator */}
          <View style={styles.separatorContainer}>
            <ThemedText style={styles.separatorText}>
              {"Dealer - " + gameState.dealerCards}
            </ThemedText>
            <View style={styles.separatorLine} />
            <ThemedText style={styles.separatorText}>
              {"Player - " + gameState.playerCards}
            </ThemedText>
          </View>

          {/* Bottom buttons below the camera */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.sideButton}>
              <ThemedText style={styles.text}>Next Move</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sideButton}>
              <ThemedText style={styles.text}>Count Cards</ThemedText>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* Info Section (Green bottom half) */}
      <View style={styles.bottomHalf}>
        <View style={styles.row}>
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoTitle}>Bet</ThemedText>
            <ThemedText style={styles.infoText}>High</ThemedText>
          </View>
          <View style={styles.infoBox}>
            <ThemedText style={styles.infoTitle}>True Count</ThemedText>
            <ThemedText style={styles.infoText}>+3</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.actionText}>DOUBLE</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionText: {
    fontSize: 32,
    fontWeight: "bold",
    paddingTop: 20,
  },
  container: {
    flex: 1,
  },
  topHalf: {
    flex: 3, // Camera takes up 3/4 of the screen height
    borderBottomWidth: 2,
    borderBottomColor: "gold", // Gold color for the border
    justifyContent: "flex-end", // Align buttons and flip camera at the bottom of the camera
  },
  camera: {
    flex: 1,
  },
  separatorContainer: {
    position: "absolute",
    top: "50%", // Center vertically in the middle of the camera view
    left: "5%", // Add a bit of left margin for the text
    width: "90%", // Make sure the text is centered in the camera view
    alignItems: "center",
  },
  separatorText: {
    color: "white",
    fontSize: 14, // Smaller text size for dealer/player labels
    fontWeight: "bold",
    marginVertical: 5, // Space between text and the line
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    borderStyle: "dotted",
    width: "100%", // Full width for the dotted line
    marginVertical: 5, // Space between line and text
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
  },
  sideButton: {
    backgroundColor: "#ffffff77", // White background for buttons
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  text: {
    color: "#000",
    fontSize: 20,
  },

  bottomHalf: {
    flex: 1,
    backgroundColor: BlackjackTheme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoBox: {
    justifyContent: "center",
    backgroundColor: BlackjackTheme.colors.background,
    padding: 10,
    borderRadius: 4,
    width: "48%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BlackjackTheme.colors.border,
  },
  infoTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoText: {
    color: "white",
    fontSize: 20,
  },
});
