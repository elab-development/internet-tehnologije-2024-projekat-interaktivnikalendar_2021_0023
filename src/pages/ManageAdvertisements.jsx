import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageAdvertisements = () => {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({
    sadrzaj: '',
    link: '',
    vidljivo_premium: false,
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/reklame', form);
      setAds([...ads, response.data]);
      setForm({ sadrzaj: '', link: '', vidljivo_premium: false });
    } catch (error) {
      console.error('Error creating advertisement', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/reklame/${id}`);
      setAds(ads.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting advertisement', error);
    }
  };

  const handleUpdate = async (id) => {
    const adToUpdate = ads.find(ad => ad.id === id);
    try {
      const response = await axios.put(`http://localhost:8000/api/reklame/${id}`, adToUpdate);
      setAds(ads.map(ad => (ad.id === id ? response.data : ad)));
    } catch (error) {
      console.error('Error updating advertisement', error);
    }
  };

  return (
    <div>
      <h1>Manage Advertisements</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="sadrzaj"
          placeholder="Content"
          value={form.sadrzaj}
          onChange={handleChange}
        />
        <input
          type="text"
          name="link"
          placeholder="Link"
          value={form.link}
          onChange={handleChange}
        />
        <label>
          Visible to Premium Users:
          <input
            type="checkbox"
            name="vidljivo_premium"
            checked={form.vidljivo_premium}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Create Advertisement</button>
      </form>
      <ul>
        {ads.map(ad => (
          <li key={ad.id}>
            <p>{ad.sadrzaj}</p>
            <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a>
            <button onClick={() => handleDelete(ad.id)}>Delete</button>
            <button onClick={() => handleUpdate(ad.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageAdvertisements;