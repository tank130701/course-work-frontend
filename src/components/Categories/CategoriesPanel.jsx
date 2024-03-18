import React from 'react';
import { FaRegEdit } from "react-icons/fa";
import styles from "./CategoriesPanel.module.css";

const CategoriesPanel = ({ categories, onSelectCategory, onCreateCategory, onDeleteCategory, onEditStart, onSaveTitle, editingCategory }) => {
  return (
    <div className={styles["panel"]}>
      {categories.map((category) => (
        <div key={category.id} className={styles['category']}>
          {editingCategory === category.id ? (
            <input
              defaultValue={category.title}
              onBlur={(e) => onSaveTitle(category.id, e.target.value)}
              autoFocus
            />
          ) : (
            <>
              <span onClick={() => onSelectCategory(category.id)}>
                {category.title}
              </span>
              <button onClick={(e) => { e.stopPropagation(); onEditStart(category.id); }} className={styles['edit-button']}><FaRegEdit/></button>
              <button onClick={(e) => { e.stopPropagation(); onDeleteCategory(category.id); }} className={styles["delete-item-button"]}></button>
            </>
          )}
        </div>
      ))}
      <button onClick={onCreateCategory}>Создать категорию</button>
    </div>
  );
};

export default CategoriesPanel;
