import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const AddTask = () => {
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

  return (
    <main className="flex flex-col gap-6 px-[118px] py-10">
      <h1>შექმენი ახალი დავალება</h1>
      <div className="rounded-[4px] border border-[#ddd2ff] bg-[rgba(251,249,255,0.65)] py-[65px] px-[55px]">
        <Formik
          initialValues={{
            name: "",
            description: "",
            department_id: "",
            employee_id: "",
            priority_id: "2",
            status_id: "1",
            due_date: new Date().toISOString().split("T")[0],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await axios.post(
              "https://momentum.redberryinternship.ge/api/tasks",
              values,
              {
                headers: {
                  Authorization: "Bearer 9e6c7cca-7d41-4f5b-8c6d-585a9921a547",
                },
              }
            );
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className="grid grid-cols-2 gap-4">
              <div>
                <label>სათაური</label>
                <Field type="text" name="name" className="input" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div>
                <label>დეპარტამენტი</label>
                <Field
                  as="select"
                  name="department_id"
                  onChange={(e) => handleDepartmentChange(e, setFieldValue)}
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
                  className="error"
                />
              </div>
              {values.department_id && (
                <div>
                  <label>პასუხისმგებელი თანამშრომელი</label>
                  <Field as="select" name="employee_id">
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
                    className="error"
                  />
                </div>
              )}
              <div>
                <label>აღწერა</label>
                <Field as="textarea" name="description" className="input" />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <label>პრიორიტეტი</label>
                <Field as="select" name="priority_id">
                  {priorities.map((pri) => (
                    <option key={pri.id} value={pri.id}>
                      {pri.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="priority_id"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <label>სტატუსი</label>
                <Field as="select" name="status_id">
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="status_id"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <label>დედლაინი</label>
                <Field type="date" name="due_date" className="input" />
                <ErrorMessage
                  name="due_date"
                  component="div"
                  className="error"
                />
              </div>
              <button type="submit" className="btn">
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
