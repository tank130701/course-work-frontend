import React, { useState } from 'react';
import Board from './components/Board/Board';
import CategoriesPanel from './components/Categories/CategoriesPanel';
import { boardsData } from './components/Categories/Categories_base';
import './App.css';

function App() {
  const [categories, setCategories] = useState(boardsData);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [editingCategory, setEditingCategory] = useState(null);

  const handleStartEditCategory = (id) => {
    setEditingCategory(id);
  };

  const handleSaveCategoryTitle = (id, newTitle) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, title: newTitle, editing: false } : category
    );
    setCategories(updatedCategories);
    setEditingCategory(null);
  };

  const handleSelectCategory = (id) => {
    setSelectedCategoryId(id);
  };

  const handleCreateCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      title: "Новая категория",
      boards: [
        {
            id: 1,
            title: "To do",
            items: [
              { id: 1, title: 'Название задачи', description: 'Описание задачи'}
            ]
          },
          {
            id: 2,
            title: "In Progress",
            items: [
                { id: 1, title: 'Название задачи', description: 'Описание задачи'}
              ]
          },
          {
            id: 3,
            title: "Complete",
            items: [
                { id: 1, title: 'Название задачи', description: 'Описание задачи'}
              ]
          }],
      editing: false
    };
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
  };

  const selectedCategory = categories.find(category => category.id === selectedCategoryId);

  return (
    <div className="appContainer">
      <CategoriesPanel
        categories={categories}
        onSelectCategory={handleSelectCategory}
        onCreateCategory={handleCreateCategory}
        onDeleteCategory={handleDeleteCategory}
        onEditStart={handleStartEditCategory}
        onSaveTitle={handleSaveCategoryTitle}
        editingCategory={editingCategory}
      />
      {selectedCategory && <Board category={selectedCategory} />}
    </div>
  );
}

export default App;
