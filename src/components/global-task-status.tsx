import { getDateMonthYearByDate } from "@/lib/get-date-month-year";
import { getFormattedTime } from "@/lib/get-formatted-time";
import { useLocalTasks } from "@/providers/LocalTasksProvider";

export function GlobalTaskStatus() {
  const { taskHistory } = useLocalTasks();

  const todayDate = getDateMonthYearByDate(new Date());

  const totalTimeWorkedTodayMS = taskHistory.reduce((acc, curr) => {
    const date = getDateMonthYearByDate(curr.startedAt);

    if (date !== todayDate) {
      return acc;
    }

    return acc + curr.stoppedAt.getTime() - curr.startedAt.getTime();
  }, 0);

  const formattedTotalTimeWorkedToday = getFormattedTime(
    totalTimeWorkedTodayMS
  );

  return (
    <div className="flex flex-wrap">
      <TimeCard
        title="Total time today"
        formattedTime={`${formattedTotalTimeWorkedToday.formattedHours}:${formattedTotalTimeWorkedToday.formattedMinutes}:${formattedTotalTimeWorkedToday.formattedSeconds}`}
      />
    </div>
  );
}

function TimeCard({
  title,
  formattedTime,
}: {
  title: string;
  formattedTime: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-zinc-900 rounded-md p-2 px-4">
      <span className="text-muted-foreground">{title}</span>

      <span className="font-semibold">{formattedTime}</span>
    </div>
  );
}
