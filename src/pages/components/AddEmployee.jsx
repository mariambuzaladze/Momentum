import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function AddEmployee({ onClose }) {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch("https://momentum.redberryinternship.ge/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((err) => console.error("Failed to fetch departments:", err));
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Zა-ჰ]+$/, "მხოლოდ ქართული და ლათინური სიმბოლოები")
      .min(2, "მინიმუმ 2 სიმბოლო")
      .max(255, "მაქსიმუმ 255 სიმბოლო")
      .required("სავალდებულო ველი"),
    surname: Yup.string()
      .matches(/^[a-zA-Zა-ჰ]+$/, "მხოლოდ ქართული და ლათინური სიმბოლოები")
      .min(2, "მინიმუმ 2 სიმბოლო")
      .max(255, "მაქსიმუმ 255 სიმბოლო")
      .required("სავალდებულო ველი"),
    avatar: Yup.mixed()
      .required("სავალდებულო")
      .test("fileSize", "მაქსიმუმ 600KB", (file) => file && file.size <= 600000)
      .test(
        "fileType",
        "მხოლოდ სურათის ფორმატი",
        (file) => file && ["image/jpeg", "image/png"].includes(file.type)
      ),
    department_id: Yup.string().required("სავალდებულო ველი"),
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="float-right" onClick={onClose}>
          ❌
        </button>
        <h2 className="text-2xl mb-4">თანამშრომლის დამატება</h2>

        <Formik
          initialValues={{
            name: "",
            surname: "",
            avatar: null,
            department_id: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("surname", values.surname);
            formData.append("avatar", values.avatar);
            formData.append("department_id", values.department_id);

            try {
              const response = await fetch(
                "https://momentum.redberryinternship.ge/api/employees",
                {
                  method: "POST",
                  headers: {
                    Authorization:
                      "Bearer 9e6c7cca-7d41-4f5b-8c6d-585a9921a547",
                  },
                  body: formData, // Don't set Content-Type manually (FormData handles it)
                }
              );

              if (!response.ok) throw new Error("Employee creation failed");
              resetForm();
              onClose();
            } catch (error) {
              console.error("Error:", error);
            }
          }}
        >
          {({ setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label>სახელი</label>
                <Field name="name" className="border p-2 w-full" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <label>გვარი</label>
                <Field name="surname" className="border p-2 w-full" />
                <ErrorMessage
                  name="surname"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <label>ავატარი</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setFieldValue("avatar", event.target.files[0])
                  }
                />
                <ErrorMessage
                  name="avatar"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <label>დეპარტმენტი</label>
                <Field
                  as="select"
                  name="department_id"
                  className="border p-2 w-full"
                >
                  <option value="">აირჩიეთ დეპარტმენტი</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id}>
                      {dep.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="department_id"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                დამატება
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
