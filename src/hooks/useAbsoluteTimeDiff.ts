import { getFormattedTime } from "@/lib/get-formatted-time";
import { useEffect, useRef, useState } from "react";

export function useAbsoluteTimeDiff(startDate?: Date | null) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [diff, setDiff] = useState(0);

  const { hours, minutes, seconds } = getFormattedTime(diff);

  useEffect(() => {
    if (!startDate) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setDiff(startDate ? new Date().getTime() - startDate.getTime() : 0);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startDate]);

  return {
    hours,
    minutes,
    seconds,
  };
}
