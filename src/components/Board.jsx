import { useState } from 'react';


function Board() {
    const [boards, setBoards] = useState([
        {
          id: 1,
          title: "Todo",
          items: [
            { id: 1, title: 'Код Ревью', description: 'Проверить новые PRs' },
            { id: 2, title: 'Выкинуть мусор', description: 'Взять мусорные пакеты из-под раковины' }
          ]
        },
        {
          id: 2,
          title: "In Progress",
          items: [
            { id: 3, title: 'Код Ревью', description: 'Оставить комментарии' },
            { id: 4, title: 'Выкинуть мусор', description: 'Не забыть разделить перерабатываемые отходы' }
          ]
        },
        {
          id: 3,
          title: "Complete",
          items: [
            { id: 5, title: 'Код Ревью', description: 'Все задачи проверены' },
            { id: 6, title: 'Выкинуть мусор', description: 'Мусор успешно выкинут' }
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

      


   



    const renderEditButton = (boardId, itemId) => (
      <button onClick={() => startEditItem(boardId, itemId)} className="edit-item-button">✏️</button>
    );


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


  
    const handleAddOrEditItem = (boardId) => {
      setBoards(boards => boards.map(board => {
          if (board.id === boardId) {
              let items = [...board.items];
              if (editItemId) {
                  // Редактирование существующей карточки
                  items = items.map(item => item.id === editItemId ? { ...item, title: newTitle, description: newDescription } : item);
              } else {
                  // Создание новой карточки
                  const newCard = { id: Date.now(), title: newTitle, description: newDescription };
                  items.push(newCard);
              }
              return { ...board, items };
          }
          return board;
      }));
      // Сброс формы
      resetForm();
  };

  const resetForm = () => {
      setNewTitle('');
      setNewDescription('');
      setEditItemId(null);
  };

  const handleEditChange = (e, boardId, itemId, isTitle) => {
    const newText = e.target.value;
    setBoards(boards => boards.map(board => {
        if (board.id === boardId) {
            return {
                ...board,
                items: board.items.map(item => {
                    if (item.id === itemId) {
                        return isTitle ? { ...item, title: newText } : { ...item, description: newText };
                    }
                    return item;
                })
            };
        }
        return board;
    }));
};


const handleAddNewItem = (boardId) => {
  const newCard = { id: Date.now(), title: '', description: '', isEditing: true };
  setBoards(boards => boards.map(board => {
    if (board.id === boardId) {
      return { ...board, items: [...board.items, newCard] };
    }
    return board;
  }));
};

const startEditItem = (boardId, itemId) => {
  setBoards(boards => boards.map(board => {
    if (board.id === boardId) {
      return {
        ...board,
        items: board.items.map(item => item.id === itemId ? { ...item, isEditing: true } : item)
      };
    }
    return board;
  }));
};

// Обновляем функцию saveItem, чтобы принимать title и description напрямую
const saveItem = (boardId, itemId, title, description) => {
  setBoards(boards => boards.map(board => {
    if (board.id === boardId) {
      return {
        ...board,
        items: board.items.map(item => 
          item.id === itemId ? { ...item, title, description, isEditing: false } : item)
      };
    }
    return board;
  }));
};

const handleDeleteItem = (boardId, itemId) => {
  setBoards(boards => boards.map(board => {
    if (board.id === boardId) {
      return { ...board, items: board.items.filter(item => item.id !== itemId) };
    }
    return board;
  }));
};
    
    
return (
  <div className="App">
    {boards.map((board) => (
      <div className="board" key={board.id} onDragOver={(e) => dragOverHandler(e, board)} onDrop={(e) => dropHandler(e, board)}>
        <div className="board__title">{board.title}</div>
        <div className="board__content">
          {board.items.map((item) => (
            <div key={item.id} draggable={!item.isEditing} onDragStart={(e) => dragStartHandler(e, board, item)}
              onDragOver={(e) => dragOverHandler(e, board, item)}
              className={`item ${item === hoveredItem ? 'hovered' : ''}`}>
              {item.isEditing ? (
                <div>
                <input type="text" defaultValue={item.title} onChange={(e) => item.title = e.target.value} className="item-edit-form input" placeholder="Введите заголовок задачи"/>
                <textarea defaultValue={item.description} onChange={(e) => item.description = e.target.value} className="item-edit-form textarea" placeholder="Введите описание задачи"></textarea>
                <button onClick={() => saveItem(board.id, item.id, item.title, item.description)} className="item-edit-form button">Сохранить</button>
              </div>
              ) : (
                <>
                  <div><strong>{item.title}</strong></div>
                  <div>{item.description}</div>
                  <button onClick={() => startEditItem(board.id, item.id)} className="edit-item-button">Редактировать</button>
                  <button onClick={() => handleDeleteItem(board.id, item.id)} className="delete-item-button">Удалить</button>
                </>
              )}
            </div>
          ))}
<button onClick={() => handleAddNewItem(board.id)} className="add-item-button">Добавить новое дело</button>
        </div>
      </div>
    ))}
  </div>
);
}



export default Board;
