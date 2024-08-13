import { useEffect, useState, useCallback, useRef } from "react";

export function useValueOrAsyncFunc<T>(valueOrAsyncFunc: T | (() => Promise<T>), dependencies: any[] = []): { value: T; isLoading: boolean } {
  const [value, setValue] = useState<T>();
  const [loading, setLoading] = useState(true);

  const previousFuncString = useRef<string | null>(null);
  const previousDeps = useRef<any[]>([]);

  const getValue = useCallback(async () => {
    setLoading(true);
    if (typeof valueOrAsyncFunc === "function") {
      try {
        const funcString = valueOrAsyncFunc.toString();

        if (previousFuncString.current !== funcString || !deepEqual(previousDeps.current, dependencies)) {
          previousFuncString.current = funcString;
          previousDeps.current = dependencies;
          const result = await (valueOrAsyncFunc as () => Promise<T>)();
          setValue(result);
        }
      } catch (error) {
        console.error("Error executing async function to get a value:", error);
      }
    } else {
      setValue(valueOrAsyncFunc);
    }
    setLoading(false);
  }, [valueOrAsyncFunc, dependencies]);

  useEffect(() => {
    getValue();
  }, [getValue]);

  return { value: value!, isLoading: loading };
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}