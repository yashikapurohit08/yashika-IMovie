import React, { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();

export const CITIES = [
  { name: 'New York', state: 'NY', icon: '🗽' },
  { name: 'Los Angeles', state: 'CA', icon: '🎬' },
  { name: 'Chicago', state: 'IL', icon: '🌆' },
  { name: 'Toronto', state: 'ON', icon: '🍁' },
  { name: 'London', state: 'UK', icon: '🎡' },
  { name: 'Mumbai', state: 'MH', icon: '✨' }
];

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('imovies_city') || 'New York';
  });
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  const changeCity = (newCity) => {
    setSelectedCity(newCity);
    localStorage.setItem('imovies_city', newCity);
    setIsCityModalOpen(false);
  };

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        changeCity,
        cities: CITIES,
        isCityModalOpen,
        setIsCityModalOpen
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
