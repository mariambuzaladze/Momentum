import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Task from "./pages/Task";
import AddTask from "./pages/AddTask";
import Header from "./pages/components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task" element={<Task />} />
        <Route path="/addTask" element={<AddTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
