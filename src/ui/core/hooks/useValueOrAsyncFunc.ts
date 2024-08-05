import { useEffect, useState } from "react";

export function useValueOrAsyncFunc<T>(valueOrAsyncFunc: T | (() => Promise<T>)): { value: T; isLoading: boolean } {
  
  
  
  var [value, setValue] = useState<T>();
  var [loading, setLoading] = useState(true);
  
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
    setLoading(false);
  };

  useEffect(() => {
    setValue(undefined);
    setLoading(true);



    handleAsync();
  }, []);

  return { value: value!, isLoading: loading };
}
