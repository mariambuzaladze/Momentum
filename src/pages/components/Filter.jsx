import { useState, useEffect } from "react";

export default function Filter({
  filterName,
  onFilterChange,
  activeFilter,
  setActiveFilter,
}) {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [modalType, setModalType] = useState(null);

  const closeModal = () => setModalType(null);

  async function fetchData(type) {
    try {
      const response = await fetch(
        `https://momentum.redberryinternship.ge/api/${type}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer 9e6c7cca-7d41-4f5b-8c6d-585a9921a547",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  useEffect(() => {
    if (filterName === "დეპარტამენტი") fetchData("departments");
    if (filterName === "პრიორიტეტი") fetchData("priorities");
    if (filterName === "თანამშრომელი") fetchData("employees");
  }, [filterName]);

  const handleSelection = (id) => {
    if (filterName === "თანამშრომელი") {
      setSelectedItems([id]);
    } else {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const handleApplyFilter = () => {
    onFilterChange(filterName, selectedItems);
    closeModal();
    setActiveFilter(null);
  };

  const handleFilterClick = () => {
    setActiveFilter(filterName === activeFilter ? null : filterName);
  };

  return (
    <div>
      <div
        className="flex gap-3 items-center cursor-pointer"
        onClick={handleFilterClick}
      >
        <p>{filterName}</p>
        <img src="Shape (1).svg" alt="arrow down logo" />
      </div>

      {activeFilter === filterName && (
        <div className="grid gap-6 absolute top-14 left-0 p-[30px] bg-white w-[550px] border border-[#8338EC] rounded-[10px]">
          <div className="flex flex-col gap-5">
            {data.map((item) => (
              <label key={item.id} className="block">
                <input
                  type={filterName === "თანამშრომელი" ? "radio" : "checkbox"}
                  onChange={() => handleSelection(item.id)}
                  checked={selectedItems.includes(item.id)}
                />
                {item.name}
              </label>
            ))}
          </div>
          <button
            className="bg-[#8338EC] w-fit h-fit px-10 py-2 text-white rounded-[20px] justify-self-end"
            onClick={handleApplyFilter}
          >
            არჩევა
          </button>
        </div>
      )}
    </div>
  );
}
