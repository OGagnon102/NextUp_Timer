import { staticStyles } from "@/src/constants/styles";
import { Timer } from "@src/constants/types";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Timer() {
    const params = useLocalSearchParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    return (
        <SafeAreaView style={staticStyles.container}>
            <Text style={staticStyles.title}>{id}</Text>
        </SafeAreaView>
    );
}