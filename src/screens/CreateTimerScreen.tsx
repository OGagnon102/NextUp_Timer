import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Slider from "@react-native-community/slider";
import * as Crypto from 'expo-crypto';
import { useTimerStore } from "@src/store/useTimerStore";
import { staticStyles } from "@src/constants/styles";
import { router } from "expo-router";
import { GroupOption, Timer } from "@src/constants/types";

export default function CreateTimerScreen() {
  const groups = useTimerStore((s) => s.groups);
  const addTimer = useTimerStore((state) => state.addTimer);
  const addGroup = useTimerStore((state) => state.addGroup);
  const addTimerToGroup = useTimerStore((s) => s.addTimerToGroup);

  const [selectedGroup, setSelectedGroup] = useState<GroupOption>({ type: "none" });

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

    const timer: Timer = {
      id: Crypto.randomUUID(),
      name: name,
      duration: totalSeconds,
    };

    addTimer(timer);

    let groupId: string | null = null;

    if (selectedGroup.type === "existing") {
      groupId = selectedGroup.id;
    }

    if (selectedGroup.type === "new") {
      groupId = Crypto.randomUUID();

      addGroup({
        id: groupId,
        name: "New group",
        timerIds: [],
      });
    }

    if (groupId) {
      addTimerToGroup(timer.id, groupId);
    }

    // reset
    setName("");
    setHours(0);
    setMinutes(0);
    setSeconds(0);

    setSelectedGroup({ type: "none" });

    if (router.canGoBack()) {
      router.back();
    }
  }

  return (
    <>
      <Text style={staticStyles.title}>Créer un timer</Text>

      {/* Nom */}
      <Text style={staticStyles.label}>Nom :</Text>
      <TextInput
        style={staticStyles.input}
        placeholder="Ex: Workout"
        value={name}
        onChangeText={setName}
      />

      <Text style={staticStyles.label}>Groupe :</Text>
      {groups.map((g) => (
        <Pressable
          key={g.id}
          onPress={() => setSelectedGroup({ type: "existing", id: g.id })}
          style={{ padding: 10 }}
        >
          <Text>
            {selectedGroup.type === "existing" && selectedGroup.id === g.id
              ? "✔ "
              : ""}
            {g.name}
          </Text>
        </Pressable>
      ))}

      <Pressable
        onPress={() => setSelectedGroup({ type: "new" })}
        style={{ padding: 10 }}
      >
        <Text>
          {selectedGroup.type === "new" ? "✔ " : ""}Nouveau groupe
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setSelectedGroup({ type: "none" })}
        style={{ padding: 10 }}
      >
        <Text>
          {selectedGroup.type === "none" ? "✔ " : ""}Aucun
        </Text>
      </Pressable>

      {/* Durée */}
      <Text style={staticStyles.label}>Heure(s) :</Text>
      <SliderStepper value={hours} onChange={setHours} max={23} />

      <Text style={staticStyles.label}>Minute(s) :</Text>
      <SliderStepper value={minutes} onChange={setMinutes} />
      
      <Text style={staticStyles.label}>Seconde(s) :</Text>
      <SliderStepper value={seconds} onChange={setSeconds} />
      
      {/* Erreur */}
      {error ? <Text style={staticStyles.error}>{error}</Text> : null}

      {/* Bouton */}
      <Pressable style={staticStyles.button} onPress={handleCreate}>
        <Text style={staticStyles.buttonText}>Créer</Text>
      </Pressable>
    </>
  );
}

function SliderStepper({
  value,
  onChange,
  max = 59,
}: {
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
  max?: number;
}) {
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  function startChanging(delta: number) {
    stopChanging();

    // ⏱ délai avant de considérer un "hold"
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onChange((prev) => {
          const next = Math.min(max, Math.max(0, prev + delta));
          return next;
        });
      }, 100);
    }, 300); // ← délai avant auto-repeat
  }

  function stopChanging() {
    // stop interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // stop timeout
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }
  
  return (
    <View style={{ alignItems: "center", gap: 8 }}>
      
      {/* valeur */}
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        {value}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* - */}
        <Pressable
          onPress={() => onChange(Math.max(0, value - 1))}
          onPressIn={() => startChanging(-1)}
          onPressOut={stopChanging}
          style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
        >
          <Text style={{ fontSize: 20 }}>−</Text>
        </Pressable>

        {/* slider */}
        <Slider
          style={{ flex: 1 }}
          minimumValue={0}
          maximumValue={max}
          step={1}
          value={value}
          onValueChange={onChange}
        />

        {/* + */}
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          onPressIn={() => startChanging(1)}
          onPressOut={stopChanging}
          style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
        >
          <Text style={{ fontSize: 20 }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}
