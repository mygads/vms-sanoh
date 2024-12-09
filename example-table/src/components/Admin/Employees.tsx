import React, { useEffect, useState } from 'react';
import { fetchEmployeeData, submitEmployeeData, deleteEmployeeData, updateEmployeeData } from '../../services/apiService';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
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

  useEffect(() => {
    const loadEmployees = async () => {
      const employeeData = await fetchEmployeeData();
      setEmployees(employeeData);
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
    const newEmployee: Employee = {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      nik: formData.nik,
      phone_number: formData.phone_number,
    };
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

  const handleDeleteConfirmation = (employeeNik: string) => {
    const isConfirmed = window.confirm('Apakah anda yakin ingin menghapus?');
    if (isConfirmed) {
      toast.promise(handleDelete(employeeNik), {
        pending: 'Processing deletion...',
        success: 'Employee deleted successfully!',
        error: 'Error deleting employee!',
      });
    } else {
      toast.info('Deletion canceled');
    }
  };
  
  const handleDelete = async (employeeNik: string) => {
    try {
      await deleteEmployeeData(employeeNik);
      setEmployees(employees.filter((employee) => employee.nik !== employeeNik));
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error; // Re-throw the error so toast.promise can catch it
    }
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

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100 w-full mt-4">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-950 text-white text-base border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">NIK</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone Number</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.nik} className="bg-white hover:bg-gray-100">
                <td className="px-4 py-2">{employee.nik}</td>
                <td className="px-4 py-2">{employee.name}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.phone_number}</td>
                <td className="px-4 py-2">{employee.department}</td>
                <td className="px-4 py-2 flex justify-around">
                  <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-800">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDeleteConfirmation(employee.nik)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
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
