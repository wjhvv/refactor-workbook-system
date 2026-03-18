import type { Dispatch, SetStateAction } from "react";

type NestedRecord<V> = Record<string, Record<string, V>>;

/**
 * Update a value two levels deep in a nested Record state,
 * avoiding repeated spread boilerplate.
 */
export function updateNested2<V>(
  setState: Dispatch<SetStateAction<NestedRecord<V>>>,
  k1: string,
  k2: string,
  value: V | ((prev: V | undefined) => V),
): void {
  setState((prev) => ({
    ...prev,
    [k1]: {
      ...(prev[k1] ?? {}),
      [k2]:
        typeof value === "function"
          ? (value as (prev: V | undefined) => V)(prev[k1]?.[k2])
          : value,
    },
  }));
}
