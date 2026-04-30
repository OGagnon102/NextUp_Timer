import { staticStyles } from "@/src/constants/styles";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Inventory() {
  return (
    <SafeAreaView style={staticStyles.container}>
      <Text style={staticStyles.title}>Liste des timers</Text>
    </SafeAreaView>
  );
}