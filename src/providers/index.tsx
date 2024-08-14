import type { PropsWithChildren } from "react";
import { LocalTasksProvider } from "./LocalTasksProvider";

export function Providers({ children }: PropsWithChildren) {
  return <LocalTasksProvider>{children}</LocalTasksProvider>;
}
