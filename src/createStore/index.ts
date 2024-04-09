import { useEffect, useState } from "react"

type Subscriber<T> = (value: T) => void

const createSignal = <T extends object>(initValue: (() => T) | T) => {
  let _value: T = typeof initValue === 'function' ? initValue() : initValue
  const subscribers: Subscriber<T>[] = []

  const notify = () => {
    for (let subscriber of subscribers) {
      subscriber(_value)
    }
  }

  return {
    get value() { return _value },
    set value(v) {
      _value = v;
      notify()
    },
    subscribe: (newSubscriber: Subscriber<T>) => {
      subscribers.push(newSubscriber)
      return () => {
        const index = subscribers.findIndex(subscriber => subscriber === newSubscriber)
        subscribers.splice(index, 1)
      }
    }
  }
}

type InitializerFunction<State> = (set: SetFunction<State>) => State

type SetFunction<State> = (newState: Partial<State>) => void

export default function createStore<State extends object>(initializer: InitializerFunction<State>): () => State {

  const signal = createSignal<State>(() => {
    const set: SetFunction<State> = (newState) => signal.value = { ...signal.value, ...newState }
    return initializer(set)
  })

  return function use() {
    const [state, setState] = useState(signal.value)

    useEffect(() => {
      const unsubscribe = signal.subscribe((newState) => {
        setState(newState)
      })

      return () => unsubscribe()
    }, [])

    return state
  }
}