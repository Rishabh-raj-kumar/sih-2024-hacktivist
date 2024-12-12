import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const writeData = async (newData: { count: number; ip: string; message: string; }) => {
  try {
    const response = await fetch("https://sihapp-d06f1-default-rtdb.firebaseio.com/crowd_alert.json", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
    });
    if (response.ok) {
      toast.success(` Count : ${newData.count}\n  Ip Address : ${newData.ip} \n Message : ${newData.message}`);
    } else {
      throw new Error('Failed to write data');
    }
  } catch (error) {
    toast.error('Failed to write data!');
  }
};

const Notification = () => {
  const [data, setData] = useState<{ [key: string]: any }>({});

  const readData = async () => {
    try {
      const response = await fetch("https://sihapp-d06f1-default-rtdb.firebaseio.com/crowd_alert.json");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userData = await response.json();
      setData(userData);
    } catch (error) {
      toast.error('Failed to read data!');
    }
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1>Notification</h1>
      <p>
        {Object.keys(data).map((key) => (
          <span key={key}>
            {key}: {data[key]} <br />
          </span>
        ))}
      </p>
      <button onClick={() => writeData({ count: 6, ip: '172.00.13.56', message: "More crowd detected during savan" })}>
        Write data
      </button>
    </div>
  );
};

export default Notification;

