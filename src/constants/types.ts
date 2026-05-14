export type Timer = {
  id: string;
  name: string;
  duration: number;
};

export type TimerGroup = {
  id: string;
  name: string;
  timerIds: string[];
};

export type InventoryRow =
  | {
      id: string;
      type: "groupHeader";
      groupId: string;
      title: string;
    }
  | {
      id: string;
      type: "timer";
      timerId: string;
      groupId?: string;
    };

export type GroupOption =
  | { type: "none" }
  | { type: "new" }
  | { type: "existing"; id: string };

export type InventoryItem =
  | { type: "timer"; timer: Timer }
  | { type: "group"; group: TimerGroup }
  | { type: "groupTimer"; timer: Timer; groupId: string };

export type Section = {
  groupId?: string;
  title: string;
  data: InventoryItem[];
};