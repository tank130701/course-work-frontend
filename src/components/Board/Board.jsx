// Board.jsx
import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import ItemsService from "../../services/ItemsService";
import styles from "./Board.module.css";

function Board({ selectedCategoryId }) {
  const [tasks, setTasks] = useState([]);

  const { isLoading, refetch } = useQuery(['fetchItems', selectedCategoryId], () => ItemsService.GetAll(selectedCategoryId), {
    enabled: !!selectedCategoryId,
    onSuccess: (data) => {
      setTasks(data.data);
    },
  });

  const createItemMutation = useMutation(({ categoryId, title, description, status }) => {
    console.log("Creating item with status:", status); 
    return ItemsService.Create(categoryId, title, description, status);
}, {
    onSuccess: () => {
        console.log("Item created. Refetching...");
        refetch();
    },
});

const updateItemMutation = useMutation(({ id, title, description, status }) => {
    return ItemsService.Update(id, title, description, status);
}, {
    onSuccess: () => {
        console.log("Item updated. Refetching...");
        refetch();
    },
});


const deleteItemMutation = useMutation((id) => ItemsService.Delete(id), {
  onSuccess: () => {
    console.log("Item deleted. Refetching...");
    refetch();
  },
});



  const createNewItem = (status) => {
    createItemMutation.mutate({
      categoryId: selectedCategoryId,
      title: "Новая задача",
      description: "Описание задачи",
      status,
    });
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("application/reactflow"));
    updateItemMutation.mutate({ ...item, status: newStatus });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const boards = [
    { id: 1, title: "Todo", status: "todo" },
    { id: 2, title: "In Progress", status: "in_progress" },
    { id: 3, title: "Completed", status: "completed" },
  ];

  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [currentEditingField, setCurrentEditingField] = useState(null);

  const handleEditTitle = (item) => {
    setCurrentEditingField('title');
    setEditingItemId(item.id);
    const currentItem = tasks.find(task => task.id === item.id);
    setEditingTitle(currentItem.title);
    setEditingDescription(currentItem.description); // На случай, если пользователь решит редактировать описание
  };
  
  const handleEditDescription = (item) => {
    setCurrentEditingField('description');
    setEditingItemId(item.id);
    const currentItem = tasks.find(task => task.id === item.id);
    setEditingTitle(currentItem.title); // На случай, если пользователь решит редактировать заголовок
    setEditingDescription(currentItem.description);
  };
  

  const handleSave = async (id) => {
    const updatedTask = {
      id,
      title: editingTitle,
      description: editingDescription,
      status: tasks.find(task => task.id === id).status,
    };
  
    await updateItemMutation.mutateAsync(updatedTask, {
      onSuccess: () => {
        // Обновляем состояние, сохраняя порядок элементов
        const newTasks = tasks.map(task => {
          if (task.id === id) {
            return { ...task, ...updatedTask };
          }
          return task;
        });
  
        setTasks(newTasks);
  
        // Сброс состояния редактирования
        setEditingItemId(null);
        setCurrentEditingField(null);
      },
    });
  };
  
  
  

  const handleAutoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  

  const handleFocus = (e) => {
    const value = e.target.value;
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.value = '';
    e.target.value = value;
  };
  

  return (
    <div className={styles["mainContainer"]}>
      <div className={styles["categoryTitle"]}>Tasks</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles["boardContainer"]}>
          {boards.map((board) => (
            <div
              key={board.id}
              className={styles["board"]}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, board.status)}
            >
              <div className={styles["board__title"]}>{board.title}</div>
              {tasks && tasks.filter(task => task.status === board.status).map((item) => (
              <div
                key={item.id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item)}
                className={styles["item"]}
              >
               {editingItemId === item.id ? (
             <>
                    <div className={styles["item-content"]}>
                      {currentEditingField === 'title' ? (
                        <textarea 
                          value={editingTitle} 
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => handleSave(item.id)} 
                          onInput={handleAutoResize} 
                          className={styles["item-edit-form-input"]} 
                          autoFocus 
                          onFocus={handleFocus}
                        />
                      ) : (
                        <div className={styles["item-title"]}>
                          <strong>{editingTitle}</strong>
                        </div>
                      )}
                      {currentEditingField === 'description' ? (
                        <textarea 
                          value={editingDescription} 
                          onChange={(e) => setEditingDescription(e.target.value)}
                          onBlur={() => handleSave(item.id)} 
                          onInput={handleAutoResize} 
                          className={styles["item-edit-form-textarea"]}
                          autoFocus 
                          onFocus={handleFocus}
                        />
                      ) : (
                        <div className={styles["item-description"]}>
                          {editingDescription}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={styles["item-content"]}>
                    <div onClick={() => handleEditTitle(item)} className={styles["item-title"]}>
                      <strong>{item.title}</strong>
                    </div>
                    <div onClick={() => handleEditDescription(item)} className={styles["item-description"]}>
                      {item.description}
                    </div>
                  </div>
                )}
                <button
                  className={styles["delete-item-button"]}
                  onClick={() => deleteItemMutation.mutate(item.id)}
                />
              </div>
            ))}

               <button onClick={() => createNewItem(board.status)} className={styles["add-item-button"]}>+</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
                  }

export default Board;
