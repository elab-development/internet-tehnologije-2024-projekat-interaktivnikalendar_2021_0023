import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Advertisements = () => {
  const [ads, setAds] = useState([]);
  
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/reklame');
      setAds(response.data);
    } catch (error) {
      console.error('Error fetching advertisements', error);
    }
  };

  return (
    <div>
      <h1>Advertisements</h1>
      <ul>
        {ads.map(ad => (
          <li key={ad.id}>
            <p>{ad.sadrzaj}</p>
            <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Advertisements;