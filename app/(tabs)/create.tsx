import { staticStyles } from "@/src/constants/styles";
import { useTimerStore } from "@/src/store/useTimerStore";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from 'expo-crypto';

export default function Create() {
  const addTimer = useTimerStore((state) => state.addTimer);

  const [name, setName] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");
  const [seconds, setSeconds] = useState<string>("");

  const [error, setError] = useState("");

  const handleCreate = () => {
    setError("");

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    if (!name.trim()) {
      return setError("Le nom est requis");
    }

    if (h === 0 && m === 0 && s === 0) {
      return setError("La durée doit être supérieure à 0");
    }

    if (m >= 60 || s >= 60) {
      return setError("Minutes et secondes doivent être < 60");
    }

    const totalSeconds = h * 3600 + m * 60 + s;

    addTimer({
      id: Crypto.randomUUID(),
      name: name,
      duration: totalSeconds,
    });

    // reset
    setName("");
    setHours("");
    setMinutes("");
    setSeconds("");
  };

  return (
    <SafeAreaView style={staticStyles.container}>
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
      <Text style={staticStyles.label}>Durée</Text>

      <View style={staticStyles.row}>
        <TextInput
          style={staticStyles.inputSmall}
          placeholder="hh"
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
        />
        <TextInput
          style={staticStyles.inputSmall}
          placeholder="mm"
          keyboardType="numeric"
          value={minutes}
          onChangeText={setMinutes}
        />
        <TextInput
          style={staticStyles.inputSmall}
          placeholder="ss"
          keyboardType="numeric"
          value={seconds}
          onChangeText={setSeconds}
        />
      </View>

      {/* Erreur */}
      {error ? <Text style={staticStyles.error}>{error}</Text> : null}

      {/* Bouton */}
      <Pressable style={staticStyles.button} onPress={handleCreate}>
        <Text style={staticStyles.buttonText}>Créer</Text>
      </Pressable>
    </SafeAreaView>
  );
}
