import { useTimerStore } from "@src/store/useTimerStore";
import { useState } from "react";
import { InventoryItem } from "@src/constants/types";
import { FlatList, Pressable, Text, View } from "react-native";
import { staticStyles } from "@src/constants/styles";
import { router } from "expo-router";

export default function InventoryScreen() {
    const timers = useTimerStore((state) => state.timers);
    const groups = useTimerStore((state) => state.groups);

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    function toggleGroup(groupId: string) {
        setOpenGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    }

    function buildListData(openGroups: Record<string, boolean>): InventoryItem[] {
        const result: InventoryItem[] = [];
        const groupedTimerIds = new Set(groups.flatMap(g => g.timerIds));

        // groupes
        for (const group of groups) {
            result.push({ type: "group", group });
            if (openGroups[group.id]) {
                for (const timerId of group.timerIds) {
                    const timer = timers.find(t => t.id === timerId);
                    if (timer) {
                    result.push({
                        type: "groupTimer",
                        timer,
                        groupId: group.id,
                    });
                    }
                }
            }
        }

        // timers non groupés
        for (const timer of timers) {
            if (!groupedTimerIds.has(timer.id)) {
                result.push({ type: "timer", timer });
            }
        }

        return result;
    }

    function renderItem({ item }: { item: InventoryItem }) {
        switch (item.type) {
            case "group":
                return (
                    <Pressable onPress={() => toggleGroup(item.group.id)}>
                        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                            {item.group.name}
                        </Text>
                    </Pressable>
                );

            case "groupTimer":
                return (
                    <Pressable onPress={() => console.log("Group timer pressed")} style={{ paddingLeft: 20 }}>
                        <Text>{item.timer.name}</Text>
                    </Pressable>
                );

            case "timer":
                return (
                    <Pressable onPress={() => router.push(`/timer/${item.timer.id}`)}>
                        <Text>{item.timer.name}</Text>
                    </Pressable>
                );
        }
    }

    const data = buildListData(openGroups);

    return (
        <>
            <Text style={staticStyles.title}>Mes timers</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => {
                    if (item.type === "group") return `group-${item.group.id}`;
                    if (item.type === "timer") return `timer-${item.timer.id}`;
                    return `groupTimer-${item.timer.id}`;
                }}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", marginTop: 40 }}>
                        <Text>Aucun timer pour le moment</Text>
                        <Text>Crée ton premier timer ⏱️</Text>
                    </View>
                }
            />
        </>
    );
}