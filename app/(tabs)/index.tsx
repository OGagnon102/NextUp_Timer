import { staticStyles } from "@/src/constants/styles";
import InventoryScreen from "@/src/screens/InventoryScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Inventory() {
  return (
    <SafeAreaView style={staticStyles.container}>
      <InventoryScreen/>
    </SafeAreaView>
  );
}