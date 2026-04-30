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