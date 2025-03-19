import { useParams } from "react-router";
import { useState, useEffect } from "react";

export default function Task({ getTasks, getStatuses }) {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error("Error:", error));

    getStatuses()
      .then((data) => setStatuses(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find((t) => t.id === Number(id));
      setTask(foundTask || null);
      if (foundTask) {
        setSelectedStatus(foundTask.status?.id || "");
      }
    }
  }, [tasks, id]);

  const handleStatusChange = async (e) => {
    const newStatusId = e.target.value;
    setSelectedStatus(newStatusId);

    try {
      const response = await fetch(
        `https://momentum.redberryinternship.ge/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 9e6c7cca-7d41-4f5b-8c6d-585a9921a547`,
          },
          body: JSON.stringify({ status_id: newStatusId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the task locally to reflect the new status
      const updatedTask = {
        ...task,
        status: statuses.find((s) => s.id === newStatusId),
      };
      setTask(updatedTask);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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

  const formatDate = (isoString) => {
    const days = ["კვი", "ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ"];
    const date = new Date(isoString);
    const dayOfWeek = date.getDay();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${days[dayOfWeek]} - ${day}/${month}/${year}`;
  };

  return (
    <main className="flex pt-10 px-[120px] justify-between">
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

        <section className="flex flex-col gap-4">
          <p className="text-[#2a2a2a] text-[24px] font-medium">
            დავალების დეტალები
          </p>

          <div className="flex gap-[70px]">
            <div className="flex flex-col gap-10">
              <div className="flex gap-2">
                <img src="pie-chart.svg" alt="pie chart icon" />
                <p className="text-[#474747] leading-relaxed">სტატუსი</p>
              </div>

              <div className="flex gap-2">
                <img src="user.svg" alt="user logo" />
                <p className="text-[#474747] leading-relaxed">თანამშრომელი</p>
              </div>

              <div className="flex gap-2">
                <img src="calendar.svg" alt="calendar logo" />
                <p className="text-[#474747] leading-relaxed">დავალების ვადა</p>
              </div>
            </div>

            <div className="flex flex-col gap-10">
              <div>
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="cursor-pointer"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <img
                  src={task.employee.avatar}
                  alt="employee avatar"
                  className="w-[31px] h-[31px] rounded-full"
                />

                <div className="flex flex-col">
                  <p className="text-xs text-[#474747]">
                    {task.employee.department.name}
                  </p>
                  <p className="text-sm text-[#0d0f10]">{task.employee.name}</p>
                </div>
              </div>

              <p>{formatDate(task.due_date)}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="px-10 py-11 rounded-[10px] border border-[#ddd2ff] bg-[rgba(248,243,254,0.65)] gap-[64px]">
        <div className="flex flex-col gap-7 bg-white rounded-[10px] border border-[#adb5bd] px-5 py-4">
          <input type="text" placeholder="დაწერე კომენტარი" />
          <button>დააკომენტარე</button>
        </div>

        <div>
          <div className="flex gap-2">
            <p>კომენტარები</p>
            <div className="p-2.5 rounded-[30px] bg-[#8338ec]">
              {task.total_comments}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
