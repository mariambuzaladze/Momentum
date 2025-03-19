import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Task from "./pages/Task";
import AddTask from "./pages/AddTask";
import Header from "./pages/components/Header";

function App() {
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
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home getTasks={getTasks} />} />
        <Route path="/task/:id" element={<Task getTasks={getTasks} />} />
        <Route path="/addTask" element={<AddTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
