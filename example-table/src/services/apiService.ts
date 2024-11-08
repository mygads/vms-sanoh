import axios from 'axios';

// Define the Visitor and Employee interfaces here
export interface Visitor {
  visitor_id: string;
  visitor_date: string;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
  department: string;
  visitor_img: string;
  visitor_checkin: string;
  visitor_checkout: string | null;
}

export interface Employee {
  name: string; // Using name as the unique identifier
  nik: string;
  email: string;
  department: string;
  phone_number: string;
  employee_code: string;
}

// Visitor API functions
export const fetchVisitorData = async (): Promise<Visitor[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/visitor');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching visitor data:', error);
    return [];
  }
};

export const submitVisitorData = async (
  visitor: Omit<Visitor, 'visitor_id' | 'visitor_checkin' | 'visitor_checkout'>
): Promise<void> => {
  try {
    await axios.post('http://127.0.0.1:8000/api/create', visitor);
  } catch (error) {
    console.error('Error submitting visitor data:', error);
    throw error;
  }
};

export const checkOutVisitor = async (visitorId: string): Promise<void> => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/checkout/${visitorId}`);
  } catch (error) {
    console.error('Error checking out visitor:', error);
    throw error;
  }
};

export const allVisitor = async (): Promise<Visitor[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/index');
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor data:', error);
    throw error;
  }
};

// Employee
export const fetchEmployeeData = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/employee');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    return [];
  }
};

export const submitEmployeeData = async (employee: Employee): Promise<void> => {
  try {
    await axios.post('http://127.0.0.1:8000/api/createemployee', employee);
  } catch (error) {
    console.error('Error submitting employee data:', error);
    throw error;
  }
};

export const editEmployeeData = async (nik: string): Promise<Employee> => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/edit/${nik}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching employee data for editing:', error);
    throw error;
  }
};

export const updateEmployeeData = async (
  nik: string,
  data: Pick<Employee, 'phone_number' | 'employee_code' | 'department' | 'email'>
): Promise<void> => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/update/${nik}`, data);
  } catch (error) {
    console.error('Error updating employee data:', error);
    throw error;
  }
};

export const deleteEmployeeData = async (nik: string): Promise<void> => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/delete/${nik}`);
  } catch (error) {
    console.error('Error deleting employee data:', error);
    throw error;
  }
};
