import { getFormattedTime } from "@/lib/get-formatted-time";
import type { TaskType } from "@/providers/LocalTasksProvider";
import {
  Ellipsis,
  PencilLine,
  PlayCircle,
  StopCircle,
  Trash,
} from "lucide-react";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

type TaskProps = {
  task: TaskType;
  timeSpent: number;
  isActive: boolean;
  onStartTracking: (taskId: string) => void;
  onStopTracking: () => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: { id: string; name: string }) => void;
};

export function Task({
  task,
  timeSpent,
  isActive,
  onStartTracking,
  onStopTracking,
  onDeleteTask,
  onUpdateTask,
}: TaskProps) {
  const [taskName, setTaskName] = useState(task.name);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={() => setIsDropdownOpen(true)}
              size="icon"
              variant="ghost"
            >
              <Ellipsis className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex gap-1 w-full hover:bg-accent cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <PencilLine className="size-4" />
                  <span>Edit</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editing {task.name}?</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Task Name"
                  onChange={(e) => setTaskName(e.target.value)}
                  value={taskName}
                />
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() =>
                        onUpdateTask({
                          id: task.id,
                          name: taskName,
                        })
                      }
                      disabled={taskName === task.name || taskName === ""}
                    >
                      Update
                    </Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Destructive</DropdownMenuLabel>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="relative flex gap-1 w-full hover:bg-accent text-red-500 focus-visible:text-red-500 hover:text-red-500 focus-visible:bg-accent cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus-visible:bg-accent focus-visible:text-red-500 data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Trash className="size-4" />
                    <span>Delete</span>
                  </button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action is irreversible. Task &quot;{task.name}&quot;
                      will be deleted forever.
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
