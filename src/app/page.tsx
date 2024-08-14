"use client";

import { GlobalTaskStatus } from "@/components/global-task-status";
import { Task } from "@/components/task";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAbsoluteTimeDiff } from "@/hooks/useAbsoluteTimeDiff";
import { getDateMonthYearByDate } from "@/lib/get-date-month-year";
import {
  type TaskHistory,
  type TaskType,
  useLocalTasks,
} from "@/providers/LocalTasksProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, StopCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  task: z.string().optional(),
});

export default function Home() {
  const {
    activeTask,
    tasks,
    addTask,
    startTask,
    stopTask,
    deleteTask,
    taskHistory,
    updateTask,
  } = useLocalTasks();
  const activeTaskWithData = tasks.find(
    (task) => task.id === activeTask?.taskId
  );
  const [tasksWithTotalTime, setTasksWithTotalTime] = useState<
    Map<string, number>
  >(new Map());
  const { hours, minutes, seconds } = useAbsoluteTimeDiff(
    activeTask?.startedAt
  );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  const tasksGroupedByCreatedDate = tasks.reduce((acc, curr) => {
    const date = getDateMonthYearByDate(curr.createdAt);

    if (!acc.has(date)) {
      acc.set(date, []);
    }

    acc.get(date)?.push(curr);

    return acc;
  }, new Map<string, TaskType[]>());

  const taskSearch = form.watch("task");

  function addNewTask({ task }: z.infer<typeof formSchema>) {
    if (!task) {
      toast.error("You cannot add an empty task");
      return;
    }

    addTask(task);
    form.reset();
  }

  useEffect(() => {
    const groupedHistoryByTaskId = taskHistory.reduce((acc, curr) => {
      if (!acc.has(curr.taskId)) {
        acc.set(curr.taskId, []);
      }

      acc.get(curr.taskId)?.push(curr);

      return acc;
    }, new Map<string, TaskHistory[]>());

    for (const item of taskHistory) {
      const allFromThisTask = groupedHistoryByTaskId.get(item.taskId) ?? [];

      const diff = allFromThisTask.reduce((acc, curr) => {
        const diff = curr.stoppedAt.getTime() - curr.startedAt.getTime();
        return acc + diff;
      }, 0);

      setTasksWithTotalTime((prev) => {
        prev.set(item.taskId, diff);
        return new Map(prev);
      });
    }
  }, [taskHistory]);

  return (
    <main>
      <div className="container w-full flex justify-center">
        <div className="max-w-md w-full py-12 flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 relative">
            <div className="flex items-center justify-center w-full gap-4 relative">
              <p className="text-4xl text-center font-mono">
                {String(hours).padStart(2, "0")}:
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </p>

              {activeTask && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => stopTask()}
                >
                  <StopCircle className="size-4 stroke-red-400" />
                </Button>
              )}
            </div>

            {activeTaskWithData && (
              <div>
                <p className="text-center text-white">Tracking on</p>

                <p className="text-muted-foreground text-sm text-center">
                  {activeTaskWithData.name}
                </p>
              </div>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(addNewTask)}>
              <FormField
                control={form.control}
                name="task"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <div className="flex h-10 items-center relative">
                        <FormControl>
                          <Input
                            placeholder="Search or create task"
                            className="pr-12"
                            {...field}
                          />
                        </FormControl>
                        {taskSearch && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="!mt-0 size-8 absolute right-2"
                            type="submit"
                          >
                            <Plus className="size-4" />
                          </Button>
                        )}
                      </div>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </form>
          </Form>

          <GlobalTaskStatus />

          <div className="flex flex-col gap-4 w-full">
            {Array.from(tasksGroupedByCreatedDate.entries()).map(
              ([date, tasks]) => {
                const searchedTasks = tasks.filter((task) => {
                  return task.name
                    .toLowerCase()
                    .includes(taskSearch?.toLowerCase() ?? "");
                });
                return (
                  <div key={date} className="flex flex-col gap-2 w-full">
                    <p>{date}</p>

                    <div className="flex flex-col gap-4 w-full">
                      {searchedTasks.length > 0 &&
                        searchedTasks.map((task) => {
                          return (
                            <Task
                              key={task.id}
                              task={task}
                              timeSpent={tasksWithTotalTime.get(task.id) ?? 0}
                              isActive={activeTask?.taskId === task.id}
                              onStartTracking={startTask}
                              onStopTracking={stopTask}
                              onDeleteTask={deleteTask}
                              onUpdateTask={(task) => {
                                updateTask(task);
                              }}
                            />
                          );
                        })}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
