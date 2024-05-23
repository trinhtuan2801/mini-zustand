import { useEffect, useState } from 'react';

type Subscriber<T> = (value: T) => void;

const createSignal = <T extends object>(initValue: (() => T) | T) => {
  let _value: T = typeof initValue === 'function' ? initValue() : initValue;
  const subscribers: Subscriber<T>[] = [];

  const notify = () => {
    for (let subscriber of subscribers) {
      subscriber(_value);
    }
  };

  return {
    get value() {
      return _value;
    },
    set value(v) {
      _value = v;
      notify();
    },
    subscribe: (newSubscriber: Subscriber<T>) => {
      subscribers.push(newSubscriber);
      return () => {
        const index = subscribers.findIndex((subscriber) => subscriber === newSubscriber);
        subscribers.splice(index, 1);
      };
    },
  };
};

type StoreInitializer<S> = (set: SetStateAction<S>) => S;

type SetStateAction<S> = (newState: Partial<S>) => void;

type Hook<S> = () => S;

type SyncStateGetter<S> = () => S;

export default function createStore<S extends object>(
  storeInitializer: StoreInitializer<S>,
): [Hook<S>, SyncStateGetter<S>] {
  const set: SetStateAction<S> = (newState) => {
    signal.value = { ...signal.value, ...newState };
  };

  const signal = createSignal<S>(storeInitializer(set));

  const syncStateGetter: SyncStateGetter<S> = () => signal.value;

  const hook: Hook<S> = () => {
    const [storeState, setStoreState] = useState(signal.value);

    useEffect(() => {
      const unsubscribe = signal.subscribe((newState) => {
        setStoreState(newState);
      });

      return () => unsubscribe();
    }, []);

    return storeState;
  };

  return [hook, syncStateGetter];
}
