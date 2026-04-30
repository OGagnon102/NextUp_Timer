import { staticStyles } from "@/src/constants/styles";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView style={staticStyles.container}>
      <Text style={staticStyles.title}>Settings page</Text>
    </SafeAreaView>
  );
}