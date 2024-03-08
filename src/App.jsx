import { useState } from 'react';
import './App.css';

function App() {
  const [boards, setBoards] = useState([
    {id: 1, title: "Todo", items: [
      {id:1, title: 'Код Ревью', description: 'Проверить новые PRs'},
      {id:2, title: 'Выкинуть мусор', description: 'Взять мусорные пакеты из-под раковины'}
    ]},
    {id: 2, title: "in Progress", items: [
      {id:1, title: 'Код Ревью', description: 'Оставить комментарии'},
      {id:2, title: 'Выкинуть мусор', description: 'Не забыть разделить перерабатываемые отходы'}
    ]},
    {id: 3, title: "Complete", items: [
      {id:1, title: 'Код Ревью', description: 'Все задачи проверены'},
      {id:2, title: 'Выкинуть мусор', description: 'Мусор успешно выкинут'}
    ]},
  ])


  const [currentBoard, setCurrentBoard] = useState(null)
  const [currentItem, setCurrentItem] = useState(null)

  function dragStartHandler(e, board, item){
    setCurrentBoard(board)
    setCurrentItem(item)
  }

  function dragEndHandler(e){
    e.target.style.boxShadow = 'none'
  }

  function dragLeaveHandler(e){
    e.target.style.boxShadow = 'none'
  }

  function dragOverHandler(e){
    e.preventDefault()
    if (e.target.className === 'item'){
      e.target.style.boxShadow = '0 4px 3px gray'
    }
  }

  function dropHandler(e, board, item){
    e.preventDefault()
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    const dropIndex = board.items.indexOf(item)
    board.items.splice(dropIndex + 1, 0, currentItem)
    setBoards(boards.map(
      b => {
        if(b.id === board.id){
          return board
        }
        if(b.id === currentBoard.id){
          return currentBoard
        }
        return b
      }))
      e.target.style.boxShadow = 'none'
  } 

  function dropCardHandler(e, board){
    board.items.push(currentItem)
    const currentIndex = currentBoard.items.indexOf(currentItem)
    currentBoard.items.splice(currentIndex, 1)
    setBoards(boards.map(
      b => {
        if(b.id === board.id){
          return board
        }
        if(b.id === currentBoard.id){
          return currentBoard
        }
        return b
      }))
      e.target.style.boxShadow = 'none'
  }

  return (
    <div className="App">
      {boards.map(board =>
        <div
          className='board'
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, board)}
        > 
          <div className='board__title'>{board.title}</div>
          {
            board.items.map(
              item => 
              <div
                onDragStart={(e) => dragStartHandler(e, board, item)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, board, item)}
                draggable={true} 
                className="item"
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

export default App;
