import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import * as Crypto from 'expo-crypto';
import { useTimerStore } from "@src/store/useTimerStore";
import { staticStyles } from "@src/constants/styles";

const WHEEL_DIGIT_WIDTH = 60;

export default function CreateTimerScreen() {
  const addTimer = useTimerStore((state) => state.addTimer);

  const [name, setName] = useState<string>("");
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const [error, setError] = useState("");

  function handleCreate() {
    setError("");

    if (!name.trim()) {
      return setError("Le nom est requis");
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    addTimer({
      id: Crypto.randomUUID(),
      name: name,
      duration: totalSeconds,
    });

    // reset
    setName("");
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  function renderWheelItem(item: number) {
    return (
      <View style={{ width: WHEEL_DIGIT_WIDTH, justifyContent: "center", alignItems: "center" }}>
        <Text>{item}</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={staticStyles.title}>Créer un timer</Text>

      {/* Nom */}
      <Text style={staticStyles.label}>Nom</Text>
      <TextInput
        style={staticStyles.input}
        placeholder="Ex: Workout"
        value={name}
        onChangeText={setName}
      />

      {/* Durée */}
      <Text style={staticStyles.label}>Heure(s)</Text>
      <FlatList
        horizontal
        data={Array.from({ length: 60 }, (_, i) => i)}
        snapToInterval={WHEEL_DIGIT_WIDTH}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / WHEEL_DIGIT_WIDTH);
          setHours(index);
        }}
        renderItem={({ item }) => renderWheelItem(item)}
      />

      <Text style={staticStyles.label}>Minute(s)</Text>
      <FlatList
        horizontal
        data={Array.from({ length: 60 }, (_, i) => i)}
        snapToInterval={WHEEL_DIGIT_WIDTH}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / WHEEL_DIGIT_WIDTH);
          setMinutes(index);
        }}
        renderItem={({ item }) => renderWheelItem(item)}
      />
      
      <Text style={staticStyles.label}>Seconde(s)</Text>
      <FlatList
        horizontal
        data={Array.from({ length: 60 }, (_, i) => i)}
        snapToInterval={WHEEL_DIGIT_WIDTH}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / WHEEL_DIGIT_WIDTH);
          setSeconds(index);
        }}
        renderItem={({ item }) => renderWheelItem(item)}
      />

      {/* Erreur */}
      {error ? <Text style={staticStyles.error}>{error}</Text> : null}

      {/* Bouton */}
      <Pressable style={staticStyles.button} onPress={handleCreate}>
        <Text style={staticStyles.buttonText}>Créer</Text>
      </Pressable>
    </>
  );
}
