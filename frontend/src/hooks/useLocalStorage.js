import { useEffect, useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.log(error, "Error while getting value from localstorage");
      return initialValue;
    }
  });

  useEffect(
    () => {
      
      try {
        if(value === null || value === undefined) {
          localStorage.removeItem(key);
        }
        else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error("Error while updating localStorage:", error);
      }
    },
    [key, value]
  );
  return [value, setValue];
};
