import {useContext, useState} from 'react';
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
// import styles from "../LoginForn/LoginForm.module.css";
import styles from './Board.module.css';


function Board() {
    const { store } = useContext(Context); // Получите функцию logout из вашего StoreContext
    const navigate = useNavigate();
    // useEffect(() => {
    if (!store.isAuth) {
        navigate("/login");
    }
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
        let newValue = e.target.value;
      
        if (newValue.endsWith("\n")) {
          newValue = newValue.slice(0, -1);
        }
      
        const fieldName = field === 'title' ? 'title' : 'description';
        updateItemState(boardId, itemId, { [fieldName]: newValue });
      
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
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
      const textarea = e.target;
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
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
  <div className="App">
      <button onClick={() => {
          store.logout()
          if (!store.isAuth) {
              navigate("/login");
          }

      }}>Logout</button> {/* Добавьте кнопку выхода, которая вызывает функцию logout при клике */}
    {boards.map((board) => (
        <div className={styles.board}
             key={board.id}
             onDragOver={(e) => dragOverHandler(e, board)}
             onDrop={(e) => dropHandler(e, board)}>
            <div className={styles.board__title}>{board.title}</div>
            <div className={styles.board__content}>
                {board.items.map((item) => (
                    <div key={item.id} draggable={!item.isEditingTitle && !item.isEditingDescription}
                         onDragStart={(e) => dragStartHandler(e, board, item)}
                         className={`item ${item === hoveredItem ? 'hovered' : ''}`}>
                        {item.isEditingTitle ? (
                            <input
                                autoFocus
                                type="text"
                                value={item.title}
                                onChange={(e) => handleInputChange(e, board.id, item.id, 'title')}
                                onBlur={() => handleBlurSaveTitle(board.id, item.id, item.title)}
                                onKeyDown={(e) => e.key === 'Enter' && handleBlurSaveTitle(board.id, item.id, item.title)}
                                // className="item-edit-form input"
                                className={styles.itemEditForm}
                            />
                        ) : (
                            <div onClick={() => handleEditTitle(board.id, item.id)}><strong>{item.title}</strong></div>
                        )}
                        {item.isEditingDescription ? (
                            <textarea
                                autoFocus
                                value={item.description}
                                onChange={(e) => handleInputChange(e, board.id, item.id, 'description')}
                                onBlur={() => handleBlurSaveDescription(board.id, item.id)}
                                onInput={handleInput}
                                onFocus={handleFocus}
                                // className={"item-edit-form textarea"}
                                className={styles.itemEditForm}
                            ></textarea>


                        ) : (
                            <div
                                className={styles.itemDescription}
                                onClick={() => handleEditDescription(board.id, item.id)}
                                style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}
                            >
                                {item.description}
                            </div>
                        )
                        }
                        <button onClick={() => handleDeleteItem(board.id, item.id)}
                                className={styles.deleteItemButton}></button>
                    </div>
                ))}
                <button onClick={() => handleAddNewItem(board.id)} className={styles.addItemButton}></button>
            </div>
        </div>
    ))}
  </div>
);

}



export default Board;
