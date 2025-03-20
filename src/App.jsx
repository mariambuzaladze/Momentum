import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Task from "./pages/Task";
import AddTask from "./pages/AddTask";
import Header from "./pages/components/Header";
import AddEmployee from "./pages/components/AddEmployee";

function App() {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

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
        "https://momentum.redberryinternship.ge/api/statuses"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Statuses failed:", error);
    }
  }

  return (
    <BrowserRouter>
      <Header onOpenModal={() => setIsEmployeeModalOpen(true)} />
      <Routes>
        <Route
          path="/"
          element={<Home getTasks={getTasks} getStatuses={getStatuses} />}
        />
        <Route
          path="/task/:id"
          element={<Task getTasks={getTasks} getStatuses={getStatuses} />}
        />
        <Route path="/addTask" element={<AddTask />} />
      </Routes>

      {isEmployeeModalOpen && (
        <AddEmployee onClose={() => setIsEmployeeModalOpen(false)} />
      )}
    </BrowserRouter>
  );
}

export default App;
