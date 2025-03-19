import { useEffect, useState } from "react";
import TaskOverview from "./components/TaskOverview";
import Filter from "./components/Filter";

export default function Home({ getTasks, getStatuses }) {
  const [tasks, setTasks] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    department: [],
    priority: [],
    employee: [],
  });
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      })
      .catch((error) => console.error("Error:", error));

    getStatuses()
      .then((data) => setStatuses(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleFilterChange = (filterName, selectedItems) => {
    const filterMapping = {
      დეპარტამენტი: "department",
      პრიორიტეტი: "priority",
      თანამშრომელი: "employee",
    };

    const englishFilterName = filterMapping[filterName];
    setSelectedFilters((prev) => {
      const updatedFilters = { ...prev, [englishFilterName]: selectedItems };
      return updatedFilters;
    });
  };

  const filterTasks = (tasks, filters) => {
    return tasks.filter((task) => {
      const isDepartmentMatch =
        filters.department.length === 0 ||
        filters.department.includes(task.department.id);

      const isPriorityMatch =
        filters.priority.length === 0 ||
        filters.priority.includes(task.priority.id);

      const isEmployeeMatch =
        filters.employee.length === 0 ||
        filters.employee.includes(task.employee.id);

      return isDepartmentMatch && isPriorityMatch && isEmployeeMatch;
    });
  };

  useEffect(() => {
    const filtered = filterTasks(tasks, selectedFilters);
    setFilteredTasks(filtered);
  }, [selectedFilters, tasks]);

  return (
    <main className="flex flex-col pt-5 px-[100px] gap-[55px]">
      <h1 className="text-[34px] font-semibold">დავალებების გვერდი</h1>

      <section className="relative flex gap-[45px] px-4 py-2 w-fit rounded-[10px] border border-[#dee2e6]">
        <Filter
          filterName="დეპარტამენტი"
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <Filter
          filterName="პრიორიტეტი"
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        <Filter
          filterName="თანამშრომელი"
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </section>

      <section className="grid grid-cols-4 gap-x-[65px] gap-y-[30px]">
        {statuses.map((status) => {
          const statusColors = {
            1: "bg-[#f7bc30]",
            2: "bg-[#fb5607]",
            3: "bg-[#ff006e]",
            4: "bg-[#3a86ff]",
          };

          return (
            <div key={status.id} className="flex flex-col gap-4">
              <div
                className={`border rounded-[10px] py-4 flex justify-center items-center text-white text-[20px] ${
                  statusColors[status.id]
                }`}
              >
                {status.name}
              </div>

              <div className="flex flex-col gap-4">
                {filteredTasks
                  .filter((task) => task.status.id === status.id)
                  .map((task) => (
                    <TaskOverview key={task.id} task={task} />
                  ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
