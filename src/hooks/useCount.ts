import createStore from '../createStore';

interface CountStore {
  count: number;
  setCount: (count: number) => void;
}

const [useCount, getSyncCount] = createStore<CountStore>((set) => ({
  count: 0,
  setCount: (count: number) => {
    set({ count });
  },
}));

export { useCount, getSyncCount };
