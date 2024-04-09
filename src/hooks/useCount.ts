import createStore from "../createStore"

interface UseCount {
  count: number
  setCount: (count: number) => void
}

export const useCount = createStore<UseCount>(set => ({
  count: 0,
  setCount: (count: number) => {
    set({ count })
  }
}))