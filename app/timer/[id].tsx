import { staticStyles } from "@/src/constants/styles";
import { useTimerStore } from "@/src/store/useTimerStore";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TimerView() {
    const params = useLocalSearchParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const getTimerById = useTimerStore((state) => state.getTimerById);

    const timer = getTimerById(id);
    
    return (
        <SafeAreaView style={staticStyles.container}>
            <Text style={staticStyles.title}>{timer?.name}</Text>
            <Text style={staticStyles.title}>{timer?.duration}</Text>
        </SafeAreaView>
    );
}