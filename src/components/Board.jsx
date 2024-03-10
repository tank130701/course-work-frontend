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
    
      const addNewItem = (boardId) => {
        const newCard = {
          id: Date.now(),
          title: newTitle,
          description: newDescription
        };
    
        setBoards(boards => boards.map(board => {
          if (board.id === boardId) {
            return { ...board, items: [...board.items, newCard] };
          }
          return board;
        }));
    
        setNewTitle('');
        setNewDescription('');
      };
    
      function dragStartHandler(e, board, item) {
        setCurrentBoard(board);
        setCurrentItem(item);
      }
    
      function dragOverHandler(e) {
        e.preventDefault();
      }
    
      function dropHandler(e, board) {
        e.preventDefault();
        if (currentItem && currentBoard) {
          if (currentBoard.id === board.id) {
            setCurrentBoard(null);
            setCurrentItem(null);
            return;
          }
    
          const updatedBoards = boards.map(b => {
            // Удаление элемента из его текущего местоположения
            if (b.id === currentBoard.id) {
              return { ...b, items: b.items.filter(i => i.id !== currentItem.id) };
            } else if (b.id === board.id) {
              // Добавление элемента на новую доску
              return { ...b, items: [...b.items, currentItem] };
            }
            return b;
          });
    
          setBoards(updatedBoards);
        }
        // Сброс текущего состояния перетаскивания
        setCurrentBoard(null);
        setCurrentItem(null);
      }
    
      return (
        <div className="App">
          {boards.map(board => (
            <div
              className='board'
              key={board.id}
              onDragOver={dragOverHandler}
              onDrop={(e) => dropHandler(e, board)}
            >
              <div className='board__title'>{board.title}</div>
              {board.id === 1 && (
                <div className='item add-new-item'>
                  <input
                    type="text"
                    placeholder="Заголовок"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Описание"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                  <button onClick={() => addNewItem(board.id)}>Создать новое дело</button>
                </div>
              )}
              {board.items.map(item => (
                <div
                  key={item.id}
                  onDragStart={(e) => dragStartHandler(e, board, item)}
                  onDragOver={(e) => dragOverHandler(e)}
                  onDrop={(e) => dropHandler(e, board)}
                  draggable={true}
                  className="item"
                >
                  <div><strong>{item.title}</strong></div>
                  <div>{item.description}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
};

export default Board;
