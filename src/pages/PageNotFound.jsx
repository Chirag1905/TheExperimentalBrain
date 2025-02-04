import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.css'; // Import the CSS file

const PageNotFound = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(5);

  // Redirect to the home page after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          clearInterval(interval); // Stop the interval when time reaches 1
          navigate('/'); // Redirect to the home page
        }
        return prevTime - 1; // Decrement the time
      });
    }, 1000); // Update every 1 second (1000 milliseconds)

    // Cleanup the interval if the component unmounts
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="page-not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>You will be redirected to the home page in {time} seconds...</p>
    </div>
  );
};

export default PageNotFound;