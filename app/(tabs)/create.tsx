import { staticStyles } from "@/src/constants/styles";
import { useTimerStore } from "@/src/store/useTimerStore";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Create() {
    const addTimer = useTimerStore((state) => state.addTimer);

    return (
        <SafeAreaView style={staticStyles.container}>
        <Text style={staticStyles.title}>Créer un timer</Text>
        </SafeAreaView>
    );
}