import { create } from "zustand";
import { Timer, TimerGroup } from "@src/constants/types";
import { storage } from "@src/storage/mmkv";

type State = {
  timers: Timer[];
  groups: TimerGroup[];

  addTimer: (timer: Timer) => void;
  addGroup: (group: TimerGroup) => void;
};

export const useTimerStore = create<State>((set, get) => ({
  timers: JSON.parse(storage.getString("timers") || "[]"),
  groups: JSON.parse(storage.getString("groups") || "[]"),

  addTimer: (timer) => {
    const updated = [...get().timers, timer];
    storage.set("timers", JSON.stringify(updated));
    set({ timers: updated });
  },

  addGroup: (group) => {
    const updated = [...get().groups, group];
    storage.set("groups", JSON.stringify(updated));
    set({ groups: updated });
  },
}));