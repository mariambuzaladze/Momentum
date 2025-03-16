import { format } from "date-fns";
import { ka } from "date-fns/locale";

export default function TaksOverview({ task }) {
  const formatDueDate = (dateString) => {
    return format(new Date(dateString), "dd MMM yy", { locale: ka });
  };

  const getStatusStyles = (statusName) => {
    switch (statusName) {
      case "დასაწყები":
        return "border-[#f7bc30]";

      case "პროგრესში":
        return "border-[#fb5607]";
      case "მზად ტესტირებისთვის":
        return "border-[#ff006e]";
      case "დასრულებული":
        return "border-[#3a86ff]";
    }
  };

  const statusBgColor = getStatusStyles(task.status.name);

  const getPriorityStyles = (priorityName) => {
    switch (priorityName) {
      case "დაბალი":
        return {
          textColor: "text-[#08a508]",
          borderColor: "border-[#08a508]",
        };
      case "საშუალო":
        return {
          textColor: "text-[#ffbe0b]",
          borderColor: "border-[#ffbe0b]",
        };
      case "მაღალი":
        return {
          textColor: "text-[#fa4d4d]",
          borderColor: "border-[#fa4d4d]",
        };
    }
  };

  const { textColor, borderColor } = getPriorityStyles(task.priority.name);

  const getDepartmentBgColor = (departmentName) => {
    switch (departmentName) {
      case "ადმინისტრაციის დეპარტამენტი":
        return "bg-[#FF66A8]";
      case "ადამიანური რესურსების დეპარტამენტი":
        return "bg-[#FD9A6A]";
      case "ფინანსების დეპარტამენტი":
        return "bg-[#89B6FF]";
      case "გაყიდვები და მარკეტინგის დეპარტამენტი":
        return "bg-[#FFD86D]";
      case "ლოჯოსტიკის დეპარტამენტი":
        return "bg-[#89B6FF]";
      case "ტექნოლოგიების დეპარტამენტი":
        return "bg-[#FD9A6A]";
      case "მედიის დეპარტამენტი":
        return "bg-[#FFD86D]";
    }
  };

  const departmentBgColor = getDepartmentBgColor(task.department.name);

  return (
    <div
      className={`flex flex-col p-5 gap-7 w-[380px] rounded-[15px] border ${statusBgColor}`}
    >
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div
            className={`flex gap-1 items-center rounded-[5px] border ${borderColor} border-opacity-50 p-1`}
          >
            <img src={task.priority.icon} alt="priority icon" />
            <p className={textColor}>{task.priority.name}</p>
          </div>

          <div
            className={`w-[88px] truncate px-[9px] py-[5px] rounded-[15px] ${departmentBgColor} text-white`}
          >
            {task.department.name}
          </div>
        </div>

        <p className="text-[#212529]">{formatDueDate(task.due_date)}</p>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-medium text-[#212529]">{task.name}</p>
        <p className="text-[#343a40] truncate">{task.description}</p>
      </div>

      <div className="flex justify-between">
        <img
          src={task.employee.avatar}
          alt="employee avatar"
          className="w-[31px] h-[31px] rounded-full"
        />

        <div className="flex gap-1 items-center">
          <img src="Comments.svg" alt="comments icon" />
          <p>{task.total_comments}</p>
        </div>
      </div>
    </div>
  );
}
