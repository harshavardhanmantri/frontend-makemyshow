import React from 'react';
import { FaClock } from 'react-icons/fa';
import '../../styles/components/theaters.css';

const ShowTimings = ({ shows, onShowSelect }) => {
  // Group shows by screen
  const showsByScreen = {};
  
  shows.forEach(show => {
    const screenName = show.screenName;
    if (!showsByScreen[screenName]) {
      showsByScreen[screenName] = [];
    }
    showsByScreen[screenName].push(show);
  });
  
  // Format time from datetime string
  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };
  
  return (
    <div className="show-timings">
      {Object.keys(showsByScreen).map(screenName => (
        <div key={screenName} className="screen-shows">
          <div className="screen-name">
            <FaClock /> {screenName}
          </div>
          
          <div className="time-slots">
            {showsByScreen[screenName].map(show => (
              <button
                key={show.id}
                className="time-slot"
                onClick={() => onShowSelect(show.id)}
              >
                {formatTime(show.startTime)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowTimings;