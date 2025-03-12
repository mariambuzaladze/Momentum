import { useNavigate } from "react-router";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex w-full sticky py-[30px] px-[120px] justify-between items-centre  bg-white top-0">
      <img src="/Frame 1000006027.png" alt="header logo" />

      <div className="flex gap-10">
        <button className="border rounded-[10px] border-[#8338EC] px-5 py-2 hover:border-[#B588F4]">
          თანამშრომლის შექმნა
        </button>
        <button
          onClick={() => {
            navigate("/addTask");
          }}
          className="border rounded-[10px] bg-[#8338EC] text-white px-5 py-2 hover:bg-[#B588F4]"
        >
          + შექმენი ახალი დავალება
        </button>
      </div>
    </header>
  );
}
