// store.ts
import { action, atom, computed } from 'nanostores';

export const counter = atom(0);

export const increase = action(counter, 'increase', (store) => {
  counter.set(counter.get() + 1);
});

// Use computed stores to create chains of reactive computations.
export const doubled = computed(counter, current => current * 2);
