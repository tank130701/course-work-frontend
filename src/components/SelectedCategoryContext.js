import React, { createContext, useContext, useState } from 'react';

const SelectedCategoryContext = createContext();

export const useSelectedCategory = () => useContext(SelectedCategoryContext);

export const SelectedCategoryProvider = ({ children }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  return (
    <SelectedCategoryContext.Provider value={{ selectedCategoryId, setSelectedCategoryId }}>
      {children}
    </SelectedCategoryContext.Provider>
  );
};