import { useTimerStore } from "@src/store/useTimerStore";
import { useMemo, useState } from "react";
import { InventoryItem, InventoryRow, Section, Timer, TimerGroup } from "@src/constants/types";
import { FlatList, Pressable, SectionList, Text, View } from "react-native";
import { staticStyles } from "@src/constants/styles";
import { router } from "expo-router";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

export default function InventoryScreen() {
    const timers = useTimerStore((state) => state.timers);
    const groups = useTimerStore((state) => state.groups);
    const setGroups = useTimerStore((state) => state.setGroups);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
        groups.reduce((acc, group) => {
            acc[group.id] = true;
            return acc;
        }, {} as Record<string, boolean>)
    );

    function toggleGroup(groupId: string) {
        setOpenGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    }

    function formatDuration(seconds: number) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }

    const rows = useMemo(() => {
        const result: InventoryRow[] = [];
        const groupedTimerIds = new Set(
            groups.flatMap((group) => group.timerIds)
        );

        // GROUPS
        for (const group of groups) {
            result.push({ id: `group-${group.id}`, type: "groupHeader",
                groupId: group.id, title: group.name });

            if (openGroups[group.id]) {
                for (const timerId of group.timerIds) {
                    result.push({ id: `timer-${timerId}`, type: "timer",
                        timerId, groupId: group.id });
                }
            }
        }

        // FREE TIMERS HEADER
        result.push({ id: "group-free", type: "groupHeader",
            groupId: "free", title: "Timers" });

        // FREE TIMERS
        for (const timer of timers) {
            if (!groupedTimerIds.has(timer.id)) {
                result.push({ id: `timer-${timer.id}`, type: "timer", timerId: timer.id });
            }
        }

        return result;
    }, [groups, timers, openGroups]);

    function rebuildGroups(rows: InventoryRow[]) {
        const rebuiltGroups: TimerGroup[] = groups.map((group) => ({
            ...group,
            timerIds: [],
        }));

        let currentGroupId: string | undefined;

        for (const row of rows) {
            if (row.type === "groupHeader") {
                currentGroupId = row.groupId === "free" ? undefined : row.groupId;
                continue;
            }

            if (row.type === "timer") {
                if (!currentGroupId) {
                    continue;
                }

                const group = rebuiltGroups.find(
                    (g) => g.id === currentGroupId
                );

                if (group) {
                    group.timerIds.push(row.timerId);
                }
            }
        }

        setGroups(rebuiltGroups);
    }

    function renderItem({ item, drag, isActive }: RenderItemParams<InventoryRow>) {
        // GROUP HEADER
        if (item.type === "groupHeader") {
            const isOpen = item.groupId === "free" ? true : openGroups[item.groupId];

            return (
                <Pressable
                    style={{ padding: 12, borderBottomWidth: 1, backgroundColor: "#ddd" }}
                    onPress={() => {
                        if (item.groupId !== "free") {
                            toggleGroup(item.groupId);
                        }
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "700" }}>
                        {item.title}{" "}{item.groupId !== "free" && (isOpen ? "▼" : "▶")}
                    </Text>
                </Pressable>
            );
        }

        // TIMER ROW
        const timer = timers.find((t) => t.id === item.timerId);

        if (!timer) {
            return null;
        }

        return (
            <Pressable
                onLongPress={drag}
                delayLongPress={150}
                onPress={() => router.push(`/timer/${timer.id}`)}
                style={{ padding: 16, paddingLeft: item.groupId ? 32 : 16,
                    borderBottomWidth: 1, backgroundColor: isActive ? "#bbb" : "white",
                }}
            >
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {timer.name}
                </Text>
                <Text style={{ opacity: 0.6, marginTop: 4 }}>
                    Durée : {formatDuration(timer.duration)}
                </Text>
            </Pressable>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <Text style={staticStyles.title}>
                Mes timers
            </Text>
            <DraggableFlatList
                data={rows}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onDragEnd={({ data }) => {
                    rebuildGroups(data);
                }}
                containerStyle={{ borderWidth: 1, borderRadius: 8 }}
                ListEmptyComponent={
                    <View style={{ alignItems: "center", marginTop: 40 }}>
                        <Text>
                            Aucun timer pour le moment
                        </Text>
                        <Text>
                            Crée ton premier timer ⏱️
                        </Text>
                    </View>
                }
            />
        </View>
    );
}