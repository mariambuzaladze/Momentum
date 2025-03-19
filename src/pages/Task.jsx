import { useParams } from "react-router";
import { useState, useEffect } from "react";

export default function Task({ getTasks }) {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find((t) => t.id === Number(id));
      setTask(foundTask || null);
    }
  }, [tasks, id]);

  if (!task) return <p className="mt-10 mx-[100px] text-xl">Loading...</p>;

  const getPriorityStyles = (priorityName) => {
    switch (priorityName) {
      case "დაბალი":
        return { textColor: "text-[#08a508]", borderColor: "border-[#08a508]" };
      case "საშუალო":
        return { textColor: "text-[#ffbe0b]", borderColor: "border-[#ffbe0b]" };
      case "მაღალი":
        return { textColor: "text-[#fa4d4d]", borderColor: "border-[#fa4d4d]" };
      default:
        return { textColor: "", borderColor: "" };
    }
  };

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
      default:
        return "";
    }
  };

  const { textColor, borderColor } = getPriorityStyles(task.priority?.name);
  const departmentBgColor = getDepartmentBgColor(task.department?.name);

  return (
    <main className="flex pt-10 px-[120px]">
      <div className="flex flex-col gap-[60px]">
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 items-center">
            <div
              className={`flex gap-1 items-center rounded-[5px] border ${borderColor} border-opacity-50 p-1`}
            >
              <img src={task.priority?.icon} alt="priority icon" />
              <p className={textColor}>{task.priority?.name}</p>
            </div>

            <div
              className={`w-[88px] truncate px-[9px] py-[5px] rounded-[15px] ${departmentBgColor} text-white`}
            >
              {task.department?.name}
            </div>
          </div>

          <p className="font-semibold text-[34px] text-[#212529]">
            {task.name}
          </p>
          <p className="text-[#000] leading-relaxed">{task.description}</p>
        </div>

        <div>
          <p className="text-[#2a2a2a] text-[24px] font-medium">
            დავალების დეტალები
          </p>
        </div>
      </div>
    </main>
  );
}
