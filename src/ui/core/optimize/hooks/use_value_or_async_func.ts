import { useEffect, useState } from "react";

export function useValueOrAsyncFunc<T>(valueOrAsyncFunc: T | (() => Promise<T>)): T {
  var [value, setValue] = useState<T>();

  useEffect(() => {
    const handleAsync = async () => {
      if (typeof valueOrAsyncFunc === "function") {
        try {
          const result = await (valueOrAsyncFunc as () => Promise<T>)();
          setValue(result);
        } catch (error) {
          console.error("Error executing async function to get a value:", error);
        }
      } else {
        setValue(valueOrAsyncFunc);
      }
    };

    handleAsync();
  }, [valueOrAsyncFunc]);

  return value!;
}
