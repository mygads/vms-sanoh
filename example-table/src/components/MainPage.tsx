import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Home Page</h1>
      <button
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => navigate('/tablet')}
      >
        Go to Tablet Page
      </button>
      <button
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
        onClick={() => navigate('/security')}
      >
        Go to Security Page
      </button>
    </div>
  );
};

export default Home;