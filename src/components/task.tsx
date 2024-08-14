import { getFormattedTime } from "@/lib/get-formatted-time";
import type { TaskType } from "@/providers/LocalTasksProvider";
import { Ellipsis, PlayCircle, StopCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type TaskProps = {
  task: TaskType;
  timeSpent: number;
  isActive: boolean;
  onStartTracking: (taskId: string) => void;
  onStopTracking: () => void;
  onDeleteTask: (taskId: string) => void;
};

export function Task({
  task,
  timeSpent,
  isActive,
  onStartTracking,
  onStopTracking,
  onDeleteTask,
}: TaskProps) {
  const { hours, minutes, seconds } = getFormattedTime(timeSpent);

  function handleTrackButtonClick() {
    if (isActive) {
      onStopTracking();
      return;
    }

    onStartTracking(task.id);
  }

  return (
    <div
      key={task.id}
      className="flex items-center justify-center w-full gap-2"
    >
      <div className="border-border bg-zinc-900 rounded-sm p-4 w-full flex justify-between gap-2 items-center">
        <p>{task.name}</p>

        <span>
          {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")}
        </span>
      </div>
      <div className="flex items-center">
        <Button size="icon" variant="ghost" onClick={handleTrackButtonClick}>
          {isActive ? (
            <StopCircle className="size-4 stroke-red-400" />
          ) : (
            <PlayCircle className="size-4" />
          )}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Ellipsis className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action is irreversible. Task &quot;{task.name}&quot; will
                be deleted forever.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteTask(task.id)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
