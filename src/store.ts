import { create } from "zustand";

type StartChat = {
  start: boolean;
  change: () => void;
};

export const useStartChatStore = create<StartChat>((set) => ({
  start: true,
  change: () => {
    set((state) => ({ start: !state.start }));
  },
}));
