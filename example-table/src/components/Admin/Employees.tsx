import React, { useEffect, useState } from 'react';
import { fetchEmployeeData, submitEmployeeData, deleteEmployeeData, updateEmployeeData } from '../../services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Employee {
  name: string;
  email: string;
  department: string;
  nik: string;
  phone_number: string;
}

const EmployeeLog: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    nik: '',
    phone_number: '',
  });
  const [editingEmployeeNik, setEditingEmployeeNik] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeNikToDelete, setEmployeeNikToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeData = await fetchEmployeeData();
        setEmployees(employeeData);
      } catch (error) {
        toast.error('Error loading employee data!');
      }
    };
    loadEmployees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Employee = { ...formData };
    try {
      await submitEmployeeData(newEmployee);
      setEmployees([...employees, newEmployee]);
      setShowForm(false);
      setFormData({ name: '', email: '', department: '', nik: '', phone_number: '' });
      toast.success('Employee added successfully!');
    } catch (error) {
      toast.error('Error submitting employee data!');
    }
  };

  const openDeleteDialog = (employeeNik: string) => {
    setEmployeeNikToDelete(employeeNik);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = async () => {
    if (employeeNikToDelete) {
      try {
        await deleteEmployeeData(employeeNikToDelete); 
        setEmployees(employees.filter((employee) => employee.nik !== employeeNikToDelete));
        toast.success('Employee deleted successfully!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Error deleting employee!');
      } finally {
        setShowDeleteDialog(false);
        setEmployeeNikToDelete(null);
      }
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setEmployeeNikToDelete(null);
  };
  
  

  const handleEdit = (employee: Employee) => {
    setEditForm(true);
    setEditingEmployeeNik(employee.nik);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      nik: employee.nik,
      phone_number: employee.phone_number,
    });
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployeeNik) {
      try {
        await updateEmployeeData(editingEmployeeNik, {
          email: formData.email,
          phone_number: formData.phone_number,
          department: formData.department,
        });
        setEmployees(
          employees.map((employee) =>
            employee.nik === editingEmployeeNik
              ? { ...employee, email: formData.email, phone_number: formData.phone_number, department: formData.department }
              : employee
          )
        );
        setEditForm(false);
        setFormData({ name: '', email: '', department: '', nik: '', phone_number: '' });
        setEditingEmployeeNik(null);
        toast.success('Employee updated successfully!');
      } catch (error) {
        toast.error('Error updating employee data!');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employee Log</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setFormData({ name: '', email: '', department: '', nik: '', phone_number: '' });
          }}
          className="bg-red-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition-all"
        >
          Add Employee
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-4 md:mx-0 h-full md:h-auto md:overflow-y-auto">
            <h2 className="text-2xl font-bold mb-3 mt-6 text-center">Add New Employee</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">NIK</label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-y-auto">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mx-4 md:mx-0 h-full md:h-auto md:overflow-y-auto">
            <h2 className="text-2xl font-bold mb-3 mt-6 text-center">Edit Employee Details</h2>
            <form onSubmit={handleEditFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setEditForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow p-6 max-w-sm relative">
            <button
              type="button"
              onClick={cancelDelete}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>

            <div className="text-center">
              <svg
                className="w-20 h-20 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mt-5 mb-6">
                Are you sure you want to delete this employee?
              </h3>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-800"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100 w-full mt-4">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-950 text-white text-base border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center">NIK</th>
              <th className="px-4 py-3 text-center">Name</th>
              <th className="px-4 py-3 text-center">Email</th>
              <th className="px-4 py-3 text-center">Phone Number</th>
              <th className="px-4 py-3 text-center">Department</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.nik} className="bg-white even:bg-gray-50 hover:bg-gray-200 border border-gray-200">
                <td className="px-3 py-3 text-center">{employee.nik}</td>
                <td className="px-3 py-3 text-center">{employee.name}</td>
                <td className="px-3 py-3 text-center">{employee.email}</td>
                <td className="px-3 py-3 text-center">{employee.phone_number}</td>
                <td className="px-3 py-3 text-center">{employee.department}</td>
                <td className="px-3 py-3 text-center">
                <div className="flex justify-center items-center space-x-4">
                    <button onClick={() => handleEdit(employee)} className="mr-2 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                  onClick={() => openDeleteDialog(employee.nik)}
                  className="mr-2 text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6m4-6v6M5 6h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z"></path>
                  </svg>
                </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeLog;