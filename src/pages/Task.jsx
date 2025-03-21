import { useParams } from "react-router";
import { useState, useEffect } from "react";

export default function Task({ getTasks, getStatuses }) {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newSubComment, setNewSubComment] = useState({});

  const token = "9e6c7cca-7d41-4f5b-8c6d-585a9921a547";

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error("Error:", error));

    getStatuses()
      .then((data) => setStatuses(data))
      .catch((error) => console.error("Error:", error));
  }, [comments]);

  useEffect(() => {
    if (tasks.length > 0) {
      const foundTask = tasks.find((t) => t.id === Number(id));
      setTask(foundTask || null);
      if (foundTask) {
        setSelectedStatus(foundTask.status?.id || "");
      }
    }
  }, [tasks, id]);

  useEffect(() => {
    if (id) {
      fetch(`https://momentum.redberryinternship.ge/api/tasks/${id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setComments(data))
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [id]);

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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status_id: newStatusId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedTask = {
        ...task,
        status: statuses.find((s) => s.id === newStatusId),
      };
      setTask(updatedTask);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(
        `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: newComment, parent_id: null }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddSubComment = async (parentId) => {
    const subCommentText = newSubComment[parentId];
    if (!subCommentText?.trim()) return;

    try {
      const response = await fetch(
        `https://momentum.redberryinternship.ge/api/tasks/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: subCommentText, parent_id: parentId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add subcomment");
      }

      const newSubCommentData = await response.json();
      const updatedComments = comments.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              sub_comments: Array.isArray(comment.sub_comments)
                ? [...comment.sub_comments, newSubCommentData]
                : [newSubCommentData],
            }
          : comment
      );
      setComments(updatedComments);
      setNewSubComment({ ...newSubComment, [parentId]: "" });
    } catch (error) {
      console.error("Error adding subcomment:", error);
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

      <div className="px-10 py-11 rounded-[10px] border border-[#ddd2ff] bg-[rgba(248,243,254,0.65)] gap-[64px] w-[740px]">
        <div className="flex flex-col gap-4 bg-white rounded-[10px] border border-[#adb5bd] p-6 shadow-sm">
          <input
            type="text"
            placeholder="დაწერე კომენტარი"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <button
            onClick={handleAddComment}
            className="w-full bg-[#8338EC] text-white py-2 px-4 rounded-lg hover:bg-[#B588F4] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            დააკომენტარე
          </button>
        </div>

        <div className="mt-8">
          <div className="flex gap-2 items-center mb-6">
            <p className="text-xl font-semibold text-gray-800">კომენტარები</p>
            <div className="p-2 rounded-full bg-[#8338ec] text-white text-sm font-semibold">
              {task.total_comments}
            </div>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-[10px] border border-[#ddd2ff] p-6 shadow-sm"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={comment.author_avatar}
                    alt="author avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {comment.author_nickname}
                    </p>
                    <p className="text-gray-600 mt-1">{comment.text}</p>
                  </div>
                </div>

                {comment.sub_comments?.map((subComment) => (
                  <div key={subComment.id} className="ml-12 mt-4">
                    <div className="flex gap-4 items-start">
                      <img
                        src={subComment.author_avatar}
                        alt="author avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {subComment.author_nickname}
                        </p>
                        <p className="text-gray-600 mt-1">{subComment.text}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="ml-12 mt-4">
                  <input
                    type="text"
                    placeholder="უპასუხე"
                    value={newSubComment[comment.id] || ""}
                    onChange={(e) =>
                      setNewSubComment({
                        ...newSubComment,
                        [comment.id]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    onClick={() => handleAddSubComment(comment.id)}
                    className="mt-2 bg-[#8338EC] text-white py-1 px-4 rounded-lg hover:bg-[#B588F4] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    უპასუხე
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
