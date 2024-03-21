import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CategoriesService from "../../services/CategoriesService";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Context } from "../../index";
import styles from "./CategoriesPanel.module.css";

function CategoriesPanel ( {selectedCategoryId, setSelectedCategoryId} ) {
  const navigate = useNavigate();
  const { store } = useContext(Context);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery('categories', CategoriesService.GetAll, {
    select: data => data.data,
    onSuccess: data => {
      console.log("Fetched Categories", data.data[0].id);
      if (store.getCategory() === 0) {
        handleSelectCategory(data.data[0].id);
      } else {
        handleSelectCategory(store.getCategory());
      }
      store.setLoading(false); // Конец загрузки
      console.log("Store", store)
    }
  });

  const mutation = useMutation(newTitle => CategoriesService.Update(editingCategory, newTitle), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('categories');
    },
  });

  const createCategoryMutation = useMutation(() => CategoriesService.Create("Новая категория"), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('categories');
    },
  });

  const deleteCategoryMutation = useMutation(id => CategoriesService.Delete(id), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('categories');
    },
  });

  const handleStartEditCategory = (id) => {
    setEditingCategory(id);
  };

  const handleSaveCategoryTitle = (id, newTitle) => {
    mutation.mutate(newTitle);
    setEditingCategory(null);
  };

  const handleSelectCategory = (id) => {
    setSelectedCategoryId(id);
    store.setCategory(id);
    console.log("handleSelectCategory", id)
  };

  const handleCreateCategory = () => {
    createCategoryMutation.mutate();
  };

  const handleDeleteCategory = (id) => {
    deleteCategoryMutation.mutate(id);
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className={styles.panel}>
      <button onClick={() => {
        store.logout();
        navigate("/login");
      }}>Logout</button>

      {isLoading ? <div>Loading</div> :
        categories.data.map((category) => (
          <div 
            key={category.id} 
            className={`${styles.category} ${selectedCategoryId === category.id ? styles.selectedCategory : ''}`} 
            onClick={() => handleSelectCategory(category.id)}
          >
            {editingCategory === category.id ? (
              <input
                defaultValue={category.name}
                onBlur={(e) => handleSaveCategoryTitle(category.id, e.target.value)}
                autoFocus
                className={styles.categoryInput}
              />
            ) : (
              <>
                <span className={styles.categoryTxt}>{category.name}</span>
                <div className={styles.buttons}>
                  <button onClick={(e) => { e.stopPropagation(); handleStartEditCategory(category.id); }} className={styles.editButton}><FaRegEdit/></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }} className={styles.deleteItemButton}></button>
                </div>
              </>
            )}
          </div>
          
        ))
      }
      <button onClick={handleCreateCategory} className={styles.newCategoryButton}>+</button>
    </div>
  );
}

export default CategoriesPanel;