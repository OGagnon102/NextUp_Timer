import { StyleSheet } from "react-native";

export const staticStyles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },

  // Création timer
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  inputSmall: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    marginTop: 10,
    color: "red",
  },
});