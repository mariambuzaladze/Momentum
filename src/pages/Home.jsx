import { useEffect, useState } from "react";
import TaksOverview from "./components/TaskOverview";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatusess] = useState([]);

  async function getTasks() {
    try {
      const response = await fetch(
        "https://momentum.redberryinternship.ge/api/tasks",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer 9e6c7cca-7d41-4f5b-8c6d-585a9921a547",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Tasks failed:", error);
    }
  }

  async function getStatuses() {
    try {
      const response = await fetch(
        "https://momentum.redberryinternship.ge/api/statuses",
        {
          method: "GET",
          headers: {},
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Statuses failed:", error);
    }
  }

  useEffect(() => {
    getTasks()
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error:", error));

    getStatuses()
      .then((data) => setStatusess(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <main className="flex flex-col pt-5 px-[100px] gap-[55px]">
      <h1 className="text-[34px] font-semibold">დავალებების გვერდი</h1>

      <section className="flex gap-[45px] px-4 py-2 w-fit rounded-[10px] border border-[#dee2e6]">
        <div className="flex gap-3 items-center">
          <p>დეპარტამენტი</p>
          <img src="Shape (1).svg" alt="arrow down logo" />
        </div>

        <div className="flex gap-3 items-center">
          <p>პრიპრიტეტი</p>
          <img src="Shape (1).svg" alt="arrow down logo" />
        </div>

        <div className="flex gap-3 items-center">
          <p>თანამშრომელი</p>
          <img src="Shape (1).svg" alt="arrow down logo" />
        </div>
      </section>

      <section>
        <div className="flex justify-between">
          {statuses.map((status) => {
            const statusColors = {
              1: "bg-[#f7bc30]",
              2: "bg-[#fb5607]",
              3: "bg-[#ff006e]",
              4: "bg-[#3a86ff]",
            };

            return (
              <div
                key={status.id}
                className={`border rounded-[10px] py-4 w-[380px] flex justify-center items-center text-white text-[20px] ${
                  statusColors[status.id] || "bg-gray-400"
                }`}
              >
                {status.name}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        {tasks.map((task) => {
          return <TaksOverview key={task.id} task={task} />;
        })}
      </section>
    </main>
  );
}
