import { useEffect, useReducer } from 'react';

type Subscriber<T> = (value: T) => void;

const createSignal = <T extends object>(initValue: T) => {
  let _value = initValue;
  const subscribers: Subscriber<T>[] = [];

  const notify = () => {
    for (const subscriber of subscribers) {
      subscriber(_value);
    }
  };

  const signal = {
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

  return signal;
};

type InitStoreFn<S> = (set: SetStateFn<S>) => S;

type SetStateFn<S> = (newState: Partial<S> | ((prevState: S) => S)) => void;

type Hook<S> = () => S;

type SyncStateGetter<S> = () => S;

export default function createStore<S extends object>(
  initStore: InitStoreFn<S>,
): [Hook<S>, SyncStateGetter<S>] {
  const setFunction: SetStateFn<S> = (newState) => {
    if (typeof newState === 'function') signal.value = newState(signal.value);
    else signal.value = { ...signal.value, ...newState };
  };

  const store = initStore(setFunction);

  const signal = createSignal<S>(store);

  const hook: Hook<S> = () => {
    const [_, forceRerender] = useReducer((x) => x + 1, 0);

    useEffect(() => {
      const unsubscribe = signal.subscribe(() => {
        forceRerender();
      });

      return () => unsubscribe();
    }, []);

    return signal.value;
  };

  const syncStateGetter: SyncStateGetter<S> = () => signal.value;

  return [hook, syncStateGetter];
}
