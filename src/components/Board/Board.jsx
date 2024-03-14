import {useContext, useState} from 'react';
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import styles from './Board.module.css';

function Board() {
  
    const [boards, setBoards] = useState([
      {
        id: 1,
        title: "Todo",
        items: [
          { id: 1, title: 'Код Ревью', description: 'Проверить новые PRs', isEditing: false},
          { id: 2, title: 'Выкинуть мусор', description: 'Взять мусорные пакеты из-под раковины', isEditingTitle: false, isEditingDescription: false }
        ]
      },
      {
        id: 2,
        title: "In Progress",
        items: [
          { id: 3, title: 'Код Ревью', description: 'Оставить комментарии', isEditing: false },
          { id: 4, title: 'Выкинуть мусор', description: 'Не забыть разделить перерабатываемые отходы', isEditingTitle: false, isEditingDescription: false }
        ]
      },
      {
        id: 3,
        title: "Complete",
        items: [
          { id: 5, title: 'Код Ревью', description: 'Все задачи проверены', isEditingTitle: false, isEditingDescription: false },
          { id: 6, title: 'Выкинуть мусор', description: 'Мусор успешно выкинут' , isEditingTitle: false, isEditingDescription: false }
        ]
      }
    ]);
  

    const [currentBoard, setCurrentBoard] = useState(null);
    const [currentItem, setCurrentItem] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [addingNewItem, setAddingNewItem] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);
    const [editItemId, setEditItemId] = useState(null); 
    const [tempItemId, setTempItemId] = useState(null);

    


    const handleEditTitle = (boardId, itemId) => {
      updateItemState(boardId, itemId, { isEditingTitle: true });
    };

    const handleFocus = (e) => {
      const value = e.target.value;
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
      e.target.value = '';
      e.target.value = value;
    };
    
    const handleEditDescription = (boardId, itemId) => {
      updateItemState(boardId, itemId, { isEditingDescription: true });
    };
    
    const handleSaveItem = (boardId, itemId, title, description, field) => {
      const updates = field === 'title'
        ? { title, isEditingTitle: false }
        : { description, isEditingDescription: false };
    
      updateItemState(boardId, itemId, updates);
    };
    

    
    const handleInputChange = (e, boardId, itemId, field) => {
      const newValue = e.target.value;
  
      const fieldName = field === 'title' ? 'title' : 'description';
      updateItemState(boardId, itemId, { [fieldName]: newValue });
  
      // Динамическая корректировка высоты textarea
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.max(e.target.scrollHeight, 48)}px`; // 48px примерная высота двух строк текста
  };

    const handleBlurSaveTitle = (boardId, itemId) => {
      const item = boards.find(board => board.id === boardId)?.items.find(item => item.id === itemId);
      if (item) {
        handleSaveItem(boardId, itemId, item.title, item.description, 'title');
      }
    };
    
    const handleBlurSaveDescription = (boardId, itemId) => {
      const item = boards.find(board => board.id === boardId)?.items.find(item => item.id === itemId);
      if (item) {
        handleSaveItem(boardId, itemId, item.title, item.description, 'description');
      }
    };
    



 

  const handleAddNewItem = (boardId) => {
      const newCard = { id: Date.now(), title: 'Название задачи', description: 'Описание задачи', isEditing: true };
      const updatedBoards = boards.map(board => board.id === boardId ? { ...board, items: [...board.items, newCard] } : board);
      setBoards(updatedBoards);
  };




  const updateItemState = (boardId, itemId, updates) => {
      const updatedBoards = boards.map(board =>
          board.id === boardId ? {
              ...board,
              items: board.items.map(item =>
                  item.id === itemId ? { ...item, ...updates } : item
              )
          } : board
      );
      setBoards(updatedBoards);
  };

 

 const handleInput = (e) => {
  e.target.style.height = 'auto';
  e.target.style.height = `${Math.max(e.target.scrollHeight, 48)}px`; // Обеспечиваем минимальную высоту для двух строк
};
  
  
  




    function dragStartHandler(e, board, item) {
      setCurrentBoard(board);
      setCurrentItem(item);
    }
  
    const dragOverHandler = (e, board, item) => {
      e.preventDefault();
      setHoveredItem(item);
  };
    function dropHandler(e, board, targetItem = null) {
      e.preventDefault();
      if (!currentItem || !currentBoard) return;
      if (currentItem && currentBoard) {
          const startBoardIndex = boards.findIndex(b => b.id === currentBoard.id);
          const finishBoardIndex = boards.findIndex(b => b.id === board.id);
          
          if(startBoardIndex < 0 || finishBoardIndex < 0) return; 
  
          const itemIndex = boards[startBoardIndex].items.findIndex(i => i.id === currentItem.id);
          if(itemIndex < 0) return;
  
          const [removedItem] = boards[startBoardIndex].items.splice(itemIndex, 1);
  
          if (targetItem) {
              
              const targetIndex = boards[finishBoardIndex].items.findIndex(i => i.id === targetItem.id);
              boards[finishBoardIndex].items.splice(targetIndex, 0, removedItem);
          } else {
              
              boards[finishBoardIndex].items.push(removedItem);
          }
  
       
          setBoards([...boards]);
          setCurrentBoard(null);
          setCurrentItem(null);
          setHoveredItem(null);
      }
  }


const handleDeleteItem = (boardId, itemId) => {
setBoards(boards => boards.map(board => {
  if (board.id === boardId) {
    return { ...board, items: board.items.filter(item => item.id !== itemId) };
  }
  return board;
}));
};
  


return (
<div className={styles.boardContainer}>
  {boards.map((board) => (
    <div className={styles.board} key={board.id} onDragOver={(e) => dragOverHandler(e, board)} onDrop={(e) => dropHandler(e, board)}>
      <div className={styles.board__title}>{board.title}</div>
      <div className={styles.board__content}>
        {board.items.map((item) => (
          <div
            key={item.id}
            draggable={!item.isEditingTitle && !item.isEditingDescription}
            onDragStart={(e) => dragStartHandler(e, board, item)}
            className={`${styles.item} ${item === hoveredItem ? styles.hovered : ''}`}
          >
            {item.isEditingTitle ? (
             <input
             autoFocus
             type="text"
             value={item.title}
             onChange={(e) => handleInputChange(e, board.id, item.id, 'title')}
             onBlur={() => handleBlurSaveTitle(board.id, item.id, item.title)}
             onKeyDown={(e) => e.key === 'Enter' && handleBlurSaveTitle(board.id, item.id, item.title)}
             className={styles['item-edit-form-input']} 
           />
           
            ) : (
              <div onClick={() => handleEditTitle(board.id, item.id)} className={styles['item-title']}><strong>{item.title}</strong></div>
            )}
            {item.isEditingDescription ? (
         <textarea
         autoFocus
         value={item.description}
         onChange={(e) => handleInputChange(e, board.id, item.id, 'description')}
         onBlur={() => handleBlurSaveDescription(board.id, item.id)}
         onInput={handleInput}
         onFocus={handleFocus}
         className={styles["item-edit-form-textarea"]}
       ></textarea>
       
         
          ) : (
            <div 
              className={styles["item-description"]}
              onClick={() => handleEditDescription(board.id, item.id)} 
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {item.description}
            </div>
          )
        }
        <button onClick={() => handleDeleteItem(board.id, item.id)} className={styles["delete-item-button"]}></button>

          </div>
        ))}
        <button onClick={() => handleAddNewItem(board.id)} className={styles["add-item-button"]}></button>
      </div>
    </div>
  ))}
</div>
);

}



export default Board;
