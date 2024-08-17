import createStore from '../createStore';

interface CountStore {
  count: number;
  setCount: (count: number) => void;
  addOne: () => void;
}

const [useCount, getSyncCount] = createStore<CountStore>((set) => ({
  count: 0,
  setCount: (count: number) => {
    set({ count });
  },
  addOne: () => {
    set((prev) => ({ ...prev, count: prev.count + 1 }));
  },
}));

export { useCount, getSyncCount };
