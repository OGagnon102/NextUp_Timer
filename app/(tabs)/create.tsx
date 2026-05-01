import { staticStyles } from "@/src/constants/styles";
import CreateTimerScreen from "@/src/screens/CreateTimerScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Create() {
  return (
    <SafeAreaView style={staticStyles.container}>
      <CreateTimerScreen/>
    </SafeAreaView>
  );
}
