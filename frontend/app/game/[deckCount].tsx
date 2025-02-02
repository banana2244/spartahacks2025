import { Camera, CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BlackjackTheme } from "@/assets/BlackjackTheme";

import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

const ACTION_URL = 'http://127.0.0.1:8000/action';

export default function Game() {
  const [permission, requestPermission] = useCameraPermissions();
  const { deckCount } = useLocalSearchParams();
  const cameraRef = useRef<CameraView>(null);

  const [gameState, setGameState] = useState({
    dealerCards: 0,
    playerCards: 0,
    currentCount: 0,
    totalCardsRemaining: Number(deckCount) * 52
  });





  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log("HEY")
      if (data) {
        // Send foto!!!
        try {
          // upload the image to the server using action url using formdata
          // UPLOAD HERE
          const formData = new FormData();
      
          // Append the image file to the FormData object
          const res = await fetch(data.uri);
          const blob = await res.blob();
          formData.append('image', blob, 'photo.jpg');

          
          const response = await fetch(ACTION_URL, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Check if the request was successful
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }



          // Parse the response JSON
          const responseData = await response.json();

          // Update the game state with the response data
          setGameState((prevState) => ({
            ...prevState, // Preserve existing state
            ...responseData, // Merge the new data from the server
          }));

          console.log('Server response:', responseData);
        } catch (error) {
          console.error('Error sending image or fetching response:', error);
          
        }
      } else {
        console.error('Failed to take picture: data is undefined');
      }
    }
  }



  return (
    <View style={styles.container}>
      {/* Camera Section */}
      <View style={styles.topHalf}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          {/* Dotted line separator */}
          <View style={styles.separatorContainer}>
            <ThemedText style={styles.separatorText}>
              {"Dealer - " + gameState ? gameState.dealerCards : ""}
            </ThemedText>
            <View style={styles.separatorLine} />
            <ThemedText style={styles.separatorText}>
              {"Player - " + gameState ? gameState.playerCards : ""}
            </ThemedText>
          </View>

          {/* Bottom buttons below the camera */}
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.sideButton} onPress={takePicture}>
              <ThemedText style={styles.text}>Take Picture</ThemedText>
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
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
