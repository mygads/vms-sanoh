import React, { useEffect, useState } from 'react';

interface Employee {
  employee_id: string;
  employee_name: string;
  employee_department: string;
  employee_nik: string;
}

const EmployeeLog: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    nik: '',
  });

  // Load employees from localStorage on initial load
  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  // Update localStorage whenever employees state changes
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEmployee: Employee = {
      employee_id: Date.now().toString(),
      employee_name: formData.name,
      employee_department: formData.department,
      employee_nik: formData.nik,
    };
    setEmployees([...employees, newEmployee]);
    setShowForm(false);
    setFormData({ name: '', department: '', nik: '' });
  };

  return (
    <div className="container mx-auto p-4 relative">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Employee Log</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded mb-4"
        >
          Add Employee
        </button>

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
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-900 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Employee ID</th>
                <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Nama</th>
                <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-2 border-b border-gray-200 bg-gray-100 text-center text-sm font-semibold text-gray-700">NIK</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-200 text-center">{employee.employee_id}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">{employee.employee_name}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">{employee.employee_department}</td>
                  <td className="px-4 py-2 border-b border-gray-200 text-center">{employee.employee_nik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLog;
