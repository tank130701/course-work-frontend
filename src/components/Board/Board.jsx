import ItemsService from "../../services/ItemsService";
import React, { useEffect, useState } from 'react';
import { useQuery } from "react-query";
// import { Context } from "../../index";

import styles from "./Board.module.css";
import CategoriesService from "../../services/CategoriesService";


function Board({selectedCategoryId}) {


  // const { store } = useContext(Context);
  const [tasks, setTasks] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  // console.log("Board", selectedCategoryId)

  
  const { isLoading: isItemsLoading, refetch } = useQuery(
    ['fetchItems', selectedCategoryId],
    () => ItemsService.GetAll(selectedCategoryId),
    {
      enabled :!! selectedCategoryId,
      onSuccess: (data) => {
        console.log('data')
        console.log(data.data)
        setTasks(data.data)
      },

      onError: err => {
        console.log(err)
      }
    }
  );

  const { isLoading: isCategoryLoading } = useQuery(
    ['fetchCategory', selectedCategoryId],
    () => CategoriesService.GetById(selectedCategoryId),
    {
      enabled: !!selectedCategoryId,
      onSuccess: (data) => {
        setCategoryTitle(data.data.name);
      },
      onError: err => {
        console.log(err)
      }
    }
  );
  
  useEffect(() => {
    refetch()
    console.log("Board", selectedCategoryId)
  }, [selectedCategoryId]); // Следим за состоянием загрузки и выбранной  

  
  const [boards, setBoards] = useState([])

  useEffect(() => {
    if (tasks){
      const todoItems = tasks.filter(task => task.status === 'todo');
      const inProgressItems = tasks.filter(task => task.status === 'in_progress');
      const completedItems = tasks.filter(task => task.status === 'completed');
      setBoards(
        [
          { id: 1, title: "Todo", items: todoItems },
          { id: 2, title: "in Progress", items: inProgressItems },
          { id: 3, title: "Complete", items: completedItems },
        ]
      )
    }
    refetch()
    
  }, [tasks]); // Следим за состоянием загрузки и выбранной  


  console.log("Boards", boards)

  const [currentBoard, setCurrentBoard] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)

  function dragStartHandler(e, board, item) {
    setCurrentBoard(board)
    setCurrentItem(item)
  }

  function dragEndHandler(e) {
    e.target.style.boxShadow = 'none'
  }

  function dragLeaveHandler(e) {
    e.target.style.boxShadow = 'none'
  }

  function dragOverHandler(e) {
    e.preventDefault()
    if (e.target.className === 'item') {
      e.target.style.boxShadow = '0 4px 3px gray'
    }
  }

  function dropHandler(e, board, item) {
    e.preventDefault()
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    const dropIndex = board.items.indexOf(item)
    board.items.splice(dropIndex + 1, 0, currentItem)
    setBoards(boards.map(
      b => {
        if (b.id === board.id) {
          return board
        }
        if (b.id === currentBoard.id) {
          return currentBoard
        }
        return b
      }))
    e.target.style.boxShadow = 'none'
    console.log("drop")
  }

  function dropCardHandler(e, board) {
    board.items.push(currentItem);
    const currentIndex = currentBoard.items.indexOf(currentItem);
    currentBoard.items.splice(currentIndex, 1);
    
    // Обновляем состояние доски после перемещения карточки
    setBoards(boards.map(b => {
      if (b.id === board.id) {
        return board;
      }
      if (b.id === currentBoard.id) {
        return currentBoard;
      }
      return b;
    }));
  
    // Убираем тень после окончания перемещения
    e.target.style.boxShadow = 'none';
  
    // Обновляем статус карточки в соответствии с новой колонкой, в которую она была перемещена
    let newStatus;
    switch (board.title.toLowerCase()) {
      case 'todo':
        newStatus = 'todo';
        break;
      case 'in progress':
        newStatus = 'in_progress';
        break;
      case 'complete':
        newStatus = 'completed';
        break;
      default:
        newStatus = currentItem.status; // Если колонка не распознана, статус остается прежним
    }
  
    // Обновляем статус карточки
    ItemsService.Update(currentItem.id, currentItem.title, currentItem.description, newStatus)
      .then(() => {
        console.log('Card status updated successfully');
      })
      .catch(error => {
        console.error('Error updating card status:', error);
      });
  }

  return (
    <div className={styles.board__container}>
      <h1>{categoryTitle}</h1>
      {
        isItemsLoading && isCategoryLoading ? <div> Loading </div> :
        boards.map(board =>
        <div
          key={board.id}
          className={styles.board}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, board)}
        >
          <div className={styles.board__title}>{board.title}</div>
          { 
            selectedCategoryId &&
            board.items.map(
              item =>
                <div
                  key={item.id}
                  onDragStart={(e) => dragStartHandler(e, board, item)}
                  onDragLeave={(e) => dragLeaveHandler(e)}
                  onDragEnd={(e) => dragEndHandler(e)}
                  onDragOver={(e) => dragOverHandler(e)}
                  onDrop={(e) => dropHandler(e, board, item)}
                  draggable={true}
                  className={styles.item}
                >
                  <div><strong>{item.title}</strong></div>
                  <div>{item.description}</div>
                </div>
            )
          }
        </div>
      )}
    </div>
  );
}

export default Board;