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

      const handleAddNewItem = (boardId) => {
        const newCard = { id: Date.now(), title: newTitle, description: newDescription };
        
        setBoards(boards => boards.map(board => {
            if (board.id === boardId) {
                return { ...board, items: [...board.items, newCard] };
            }
            return board;
        }));

        setAddingNewItem({ ...addingNewItem, [boardId]: false }); // Скрыть форму добавления после создания нового дела
        // Сбросить поля ввода
        setNewTitle('');
        setNewDescription('');
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
                // Фильтруем список задач, исключая удаляемую задачу
                const filteredItems = board.items.filter(item => item.id !== itemId);
                return { ...board, items: filteredItems };
            }
            return board;
        }));
    };
    
    return (
        <div className="App">
            {boards.map((board) => (
                <div className="board" key={board.id} onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropHandler(e, board, hoveredItem)}>
                    <div className="board__title">{board.title}</div>
                    <div className="board__content">
                    {board.items.map((item, index) => (
                     <div key={item.id} draggable={true} onDragStart={(e) => dragStartHandler(e, board, item)} onDragOver={(e) => dragOverHandler(e, board, item)} className={`item ${item === hoveredItem ? 'hovered' : ''}`}>
                         <div><strong>{item.title}</strong></div>
                         <div>{item.description}</div>
                         <button onClick={() => handleDeleteItem(board.id, item.id)} className="delete-item-button">X</button>
                            </div>
                        ))}
                    </div>
                    {addingNewItem[board.id] ? (
                        <div className="add-item-form">
                            <input type="text" placeholder="Заголовок" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                            <textarea placeholder="Описание" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                            <button onClick={() => handleAddNewItem(board.id)}>Создать</button>
                        </div>
                    ) : (
                        <button className="add-item-button" onClick={() => setAddingNewItem({ ...addingNewItem, [board.id]: true })}>Добавить новое дело +</button>
                    )}
                </div>
            ))}
        </div>
    );
}



export default Board;
