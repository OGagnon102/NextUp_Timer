import { useTimerStore } from "@src/store/useTimerStore";
import { useState } from "react";
import { InventoryItem, Section, Timer } from "@src/constants/types";
import { FlatList, Pressable, SectionList, Text, View } from "react-native";
import { staticStyles } from "@src/constants/styles";
import { router } from "expo-router";

export default function InventoryScreen() {
    const timers = useTimerStore((state) => state.timers);
    const groups = useTimerStore((state) => state.groups);

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(groups.reduce((acc, group) => {
        acc[group.id] = false;
        return acc;
    }, {} as Record<string, boolean>));

    function toggleGroup(groupId: string) {
        setOpenGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    }

    function buildSections() {
        const groupedTimerIds = new Set(groups.flatMap(g => g.timerIds));

        const sections: Section[] = [];

        // GROUPS
        for (const group of groups) {
            const data: InventoryItem[] = [];

            if (openGroups[group.id]) {
                for (const timerId of group.timerIds) {
                    const timer = timers.find(t => t.id === timerId);
                    if (timer) {
                        data.push({ type: "timer", timer });
                    }
                }
            }

            sections.push({ groupId: group.id, title: group.name, data: data });
        }

        // FREE TIMERS
        const freeTimers: InventoryItem[] = timers
            .filter(t => !groupedTimerIds.has(t.id))
            .map(timer => ({ type: "timer", timer }));

        sections.push({
            title: "Timers",
            data: freeTimers,
        });

        return sections;
    }

    function formatDuration(seconds: number) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }

    function timerRow({ timer }: { timer: Timer }) {
        return (
            <View style={{ flex: 1, flexDirection: "row", borderBottomWidth: 1 }}>
                <Pressable
                    onPress={() => router.push(`/timer/${timer.id}`)}
                    style={{ padding: 12 }}
                    >
                    <Text style={{ fontSize: 16, fontWeight: "600" }}>
                        {timer.name}
                    </Text>

                    <Text style={{ opacity: 0.6 }}>
                        Durée :{formatDuration(timer.duration)}
                    </Text>
                </Pressable>
            </View>
        );
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
                return timerRow({ timer: item.timer });
        }
    }

    const sections = buildSections();

    return (
        <>
            <Text style={staticStyles.title}>Mes timers</Text>
            <SectionList
                sections={sections}
                renderSectionHeader={({ section }) => (
                    <Pressable style={{ borderBottomWidth: 1 }} onPress={() => section.groupId && toggleGroup(section.groupId)}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, padding: 4 }}>
                            {section.title} {section.groupId && (openGroups[section.groupId] ? "▼" : "▶")}
                        </Text>
                    </Pressable>
                )}
                renderItem={renderItem}
                style={{ borderWidth: 1, borderRadius: 8}}
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