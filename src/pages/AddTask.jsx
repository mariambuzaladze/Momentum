import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AddTask = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    axios
      .get("https://momentum.redberryinternship.ge/api/departments")
      .then((res) => setDepartments(res.data));
    axios
      .get("https://momentum.redberryinternship.ge/api/priorities")
      .then((res) => setPriorities(res.data));
    axios
      .get("https://momentum.redberryinternship.ge/api/statuses")
      .then((res) => setStatuses(res.data));
  }, []);

  const savedTask = JSON.parse(localStorage.getItem("taskData")) || {
    name: "",
    description: "",
    department_id: "",
    employee_id: "",
    priority_id: "2",
    status_id: "1",
    due_date: new Date().toISOString().split("T")[0],
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "მინიმუმ 3 სიმბოლო")
      .max(255, "მაქსიმუმ 255 სიმბოლო")
      .required("სავალდებულოა"),
    description: Yup.string()
      .test(
        "minWords",
        "მინიმუმ 4 სიტყვა",
        (value) => value?.split(" ").filter(Boolean).length >= 4
      )
      .max(255, "მაქსიმუმ 255 სიმბოლო"),
    department_id: Yup.number().required("სავალდებულოა"),
    employee_id: Yup.number().required("სავალდებულოა"),
    priority_id: Yup.number().required("სავალდებულოა"),
    status_id: Yup.number().required("სავალდებულოა"),
    due_date: Yup.date()
      .min(new Date(), "წარსული თარიღი დაუშვებელია")
      .required("სავალდებულოა"),
  });

  const handleDepartmentChange = async (event, setFieldValue) => {
    const departmentId = event.target.value;
    setFieldValue("department_id", departmentId);
    setFieldValue("employee_id", "");

    if (!departmentId) return;

    try {
      const res = await axios.get(
        `https://momentum.redberryinternship.ge/api/employees?department_id=${departmentId}`,
        {
          headers: {
            Authorization: "Bearer 9e6c7cca-7d41-4f5b-8c6d-585a9921a547",
          },
        }
      );
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    localStorage.setItem(
      "taskData",
      JSON.stringify({ ...savedTask, [name]: value })
    );
  };

  return (
    <main className="flex flex-col gap-6 px-[118px] py-10">
      <h1 className="text-2xl font-semibold text-gray-800">
        შექმენი ახალი დავალება
      </h1>
      <div className="rounded-lg border border-[#ddd2ff] bg-[rgba(251,249,255,0.65)] p-8 shadow-sm">
        <Formik
          initialValues={savedTask}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.post(
                "https://momentum.redberryinternship.ge/api/tasks",
                values,
                {
                  headers: {
                    Authorization:
                      "Bearer 9e6c7cca-7d41-4f5b-8c6d-585a9921a547",
                  },
                }
              );
              localStorage.removeItem("taskData");
              navigate("/");
            } catch (error) {
              console.error("Error submitting task:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  სათაური
                </label>
                <Field
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  დეპარტამენტი
                </label>
                <Field
                  as="select"
                  name="department_id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onChange={(e) => {
                    handleInputChange(e, setFieldValue);
                    handleDepartmentChange(e, setFieldValue);
                  }}
                >
                  <option value="">აირჩიეთ</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="department_id"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              {values.department_id && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    პასუხისმგებელი თანამშრომელი
                  </label>
                  <Field
                    as="select"
                    name="employee_id"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">აირჩიეთ</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} {emp.surname}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="employee_id"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>
              )}

              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  აღწერა
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  rows={4}
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  პრიორიტეტი
                </label>
                <Field
                  as="select"
                  name="priority_id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                >
                  {priorities.map((pri) => (
                    <option key={pri.id} value={pri.id}>
                      {pri.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="priority_id"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  სტატუსი
                </label>
                <Field
                  as="select"
                  name="status_id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="status_id"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  დედლაინი
                </label>
                <Field
                  type="date"
                  name="due_date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onChange={(e) => handleInputChange(e, setFieldValue)}
                />
                <ErrorMessage
                  name="due_date"
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>

              <button
                type="submit"
                className="col-span-2 w-full bg-[#8338EC] text-white py-2 px-4 rounded-lg hover:bg-[#B588F4] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                დამატება
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default AddTask;
