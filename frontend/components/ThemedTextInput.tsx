import React from "react";

import { TextInput, type TextProps, StyleSheet } from "react-native";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { BlackjackTheme } from "@/assets/BlackjackTheme";

export type ThemedTextInputProps = TextProps & {
  placeholder?: string;
  label?: string;
};

export function ThemedTextInput({
  style,
  placeholder = "",
  label = "",
  ...rest
}: ThemedTextInputProps) {
  const [text, onChangeText] = React.useState(placeholder);
  return (
    <ThemedView style={{ justifyContent: "center" }}>
      <ThemedText type="default" style={styles.labelText}>
        {label}
      </ThemedText>
      <TextInput
        style={styles.default}
        onChangeText={onChangeText}
        value={text}
        placeholder={placeholder}
        keyboardType="numeric"
        textAlign={"center"}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 2,
  },
  labelText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 24,
  },
  default: {
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
