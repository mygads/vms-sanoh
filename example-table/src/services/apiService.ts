// services/apiService.ts
import axios from 'axios';

// Define the Visitor interface here
export interface Visitor {
  visitor_id: number;
  visitor_date: string;
  visitor_name: string;
  visitor_from: string;
  visitor_host: string;
  visitor_needs: string;
  visitor_amount: number;
  visitor_vehicle: string;
  visitor_img: string;
  visitor_checkin: string;
  visitor_checkout: string | null;
}

export const fetchVisitorData = async (): Promise<Visitor[]> => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/visitor');
    return response.data.data; // Adjust according to your API response
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

// New function to handle visitor check-out
export const checkOutVisitor = async (visitorId: number): Promise<void> => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/visitor/${visitorId}/checkout`);
  } catch (error) {
    console.error('Error checking out visitor:', error);
    throw error;
  }
};
