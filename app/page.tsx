'use client';
import { useState } from 'react';
import Combobox from './components/Combobox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options = [
  { value: 1, label: 'mina' },
  { value: 2, label: 'rina' },
  { value: 3, label: 'tina' },
  { value: 4, label: 'nimra' },
  { value: 5, label: 'nusrat' }
];

const Home=()=> {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!userId || !selectedUser) {
      toast.error('Please fill all fields');
      return;
    }

    toast.success('Successfully saved 🎉');

    // Reset
    setUserId('');
    setSelectedUser(null);
    setSearchValue('');
  };

  const handleUserSelect = (value: any) => {
    setSelectedUser(value);
    // Don't clear search - value will stay in field
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="space-y-4 border p-6 rounded bg-gray-700 text-white w-96">
        <h2 className="text-lg font-semibold">Combobox Search Form</h2>

        {/* ID Input */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">ID</label>
          <input
            type="text"
            placeholder="Enter ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none px-3 py-2 dark:bg-gray-800/50 dark:text-white bg-white/80 backdrop-blur-sm transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
          />
        </div>

        {/* Combobox */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Name</label>
          <Combobox
            options={filteredOptions}
            onSelect={handleUserSelect}
            onClearSearch={() => setSearchValue('')}
            placeholder="Type to search name..."
            inputValue={searchValue}
            handleSearch={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-800 hover:bg-green-900 text-white py-2 rounded transition"
        >
          Save
        </button>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </main>
  );
}

export default Home;