"use client";

import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type TaskType = {
  id: string;
  name: string;
  createdAt: Date;
};

export type ActiveTask = {
  taskId: string;
  startedAt: Date;
  stoppedAt: Date | null;
};

export type TaskHistory = {
  taskId: string;
  startedAt: Date;
  stoppedAt: Date; // ongoing
};

type LocalTasksContextType = {
  tasks: TaskType[];
  activeTask: ActiveTask | null;
  taskHistory: TaskHistory[];
  addTask: (task: string) => void;
  startTask: (taskId: string) => void;
  stopTask: () => void;
  deleteTask: (taskId: string) => void;
  updateTask: (task: { id: string; name: string }) => void;
};

const LocalTasksContext = createContext({} as LocalTasksContextType);

export function LocalTasksProvider({ children }: PropsWithChildren) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [activeTask, setActiveTask] = useState<ActiveTask | null>(null);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);

  const syncPull = useCallback(() => {
    const tasks = localStorage.getItem("tasks");
    const activeTask = localStorage.getItem("activeTask");
    const taskHistory = localStorage.getItem("taskHistory");

    if (tasks) {
      const tsks = JSON.parse(tasks);

      if (tsks) {
        for (const task of tsks) {
          task.createdAt = new Date(task.createdAt);
        }
      }

      setTasks(tasks ? tsks : []);
    }

    if (activeTask) {
      const active = JSON.parse(activeTask);

      if (active) {
        active.startedAt = new Date(active.startedAt);
        active.stoppedAt = active.stoppedAt ? new Date(active.stoppedAt) : null;
      }

      setActiveTask(activeTask ? active : null);
    }

    if (taskHistory) {
      const history = JSON.parse(taskHistory);

      for (const item of history) {
        item.startedAt = new Date(item.startedAt);
        item.stoppedAt = new Date(item.stoppedAt);
      }

      setTaskHistory(taskHistory ? history : []);
    }
  }, []);

  async function syncPush({
    tasks: tasksParam,
    activeTask: activeTaskParam,
    taskHistory: taskHistoryParam,
  }: {
    tasks?: TaskType[];
    activeTask?: ActiveTask | null;
    taskHistory?: TaskHistory[];
  }) {
    localStorage.setItem("tasks", JSON.stringify(tasksParam ?? tasks));
    localStorage.setItem(
      "activeTask",
      JSON.stringify(activeTaskParam ?? activeTask)
    );
    localStorage.setItem(
      "taskHistory",
      JSON.stringify(taskHistoryParam ?? taskHistory)
    );
  }

  function addTask(task: string) {
    setTasks([
      ...tasks,
      { id: Math.random().toString(), name: task, createdAt: new Date() },
    ]);
    syncPush({
      tasks: [
        ...tasks,
        { id: Math.random().toString(), name: task, createdAt: new Date() },
      ],
    });
  }

  function startTask(taskId: string) {
    if (activeTask) {
      if (activeTask.taskId === taskId) {
        // same task, just ignore it
        return;
      }

      stopTask();
    }

    const taskToStart = tasks.find((task) => task.id === taskId);

    if (!taskToStart) {
      throw new Error("Task not found");
    }

    const active = {
      taskId,
      startedAt: new Date(),
      stoppedAt: null,
    };

    setActiveTask(active);
    syncPush({
      activeTask: {
        taskId,
        startedAt: new Date(),
        stoppedAt: null,
      },
    });
  }

  function stopTask() {
    if (!activeTask) {
      return;
    }

    const activeTaskHistory: TaskHistory = {
      taskId: activeTask.taskId,
      startedAt: activeTask.startedAt,
      stoppedAt: new Date(),
    };

    syncPush({
      taskHistory: [...taskHistory, activeTaskHistory],
      activeTask: null,
    });
    setTaskHistory((prev) => [...prev, activeTaskHistory]);
    setActiveTask(null);
  }

  function deleteTask(taskId: string) {
    const newTasks = tasks.filter((task) => task.id !== taskId);
    const newTaskHistory = taskHistory.filter((task) => task.taskId !== taskId);

    if (activeTask?.taskId === taskId) {
      stopTask();
    }

    setTasks(newTasks);
    setTaskHistory(newTaskHistory);
    syncPush({
      tasks: newTasks,
      taskHistory: newTaskHistory,
    });
  }

  function updateTask(task: { id: string; name: string }) {
    const newTasks = tasks.map((t) => {
      if (t.id === task.id) {
        t.name = task.name;
      }

      return t;
    });

    setTasks(newTasks);
    syncPush({
      tasks: newTasks,
    });
  }

  useEffect(() => {
    syncPull();
  }, [syncPull]);

  return (
    <LocalTasksContext.Provider
      value={{
        tasks,
        activeTask,
        taskHistory,
        addTask,
        startTask,
        stopTask,
        deleteTask,
        updateTask,
      }}
    >
      {children}
    </LocalTasksContext.Provider>
  );
}

export function useLocalTasks() {
  const context = useContext(LocalTasksContext);

  if (!context) {
    throw new Error("useLocalTasks must be used within LocalTasksProvider");
  }

  return context;
}
