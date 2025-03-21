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
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="float-right text-gray-500 hover:text-gray-700 transition-colors text-white font-bold text-lg"
          onClick={onClose}
        >
          x
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          თანამშრომლის დამატება
        </h2>

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
                  body: formData,
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
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  სახელი
                </label>
                <Field
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  გვარი
                </label>
                <Field
                  name="surname"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <ErrorMessage
                  name="surname"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ავატარი
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setFieldValue("avatar", event.target.files[0])
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                />
                <ErrorMessage
                  name="avatar"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  დეპარტმენტი
                </label>
                <Field
                  as="select"
                  name="department_id"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#8338EC] text-white py-2 px-4 rounded-lg hover:bg-[#B588F4] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
