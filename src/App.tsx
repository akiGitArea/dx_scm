import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsSpin, faUserTie, faChartPie, faChartLine, faChartColumn, faLightbulb, faCircleNotch, faTrash } from '@fortawesome/free-solid-svg-icons';
import './FloatingBubble.css';
import Draggable, { DraggableEventHandler } from 'react-draggable';

interface FloatingBubbleProps {
  items: {
    id: string,
    content: string
  }[],
  trashRef: React.RefObject<HTMLDivElement>
}

function App() {
  const trashRef = useRef<HTMLDivElement>(null);

  return (
    <div className="App">
      <header className="App-header">
        <FontAwesomeIcon icon={faArrowsSpin} className="App-logo" />
        <div className='worries'>
          <FloatingBubble items={[{ id: "worries1", content: "worries" }]} trashRef={trashRef} />
        </div>
        <FontAwesomeIcon icon={faCircleNotch} className="icon-circle" spin />
        <FontAwesomeIcon icon={faUserTie} className="icon-user" />
        <div className='indexes'>
          <FloatingBubble items={[{ id: "index1", content: "index" }]} trashRef={trashRef} />
        </div>
        <FontAwesomeIcon icon={faChartPie} className="icon-index-pie" />
        <FontAwesomeIcon icon={faChartLine} className="icon-index-line" />
        <FontAwesomeIcon icon={faChartColumn} className="icon-index-column" />
        <p className="icon-index-ai">AI</p>
        <div className='innovation'>
          <FloatingBubble items={[{ id: "innovation", content: "innovation" }]} trashRef={trashRef} />
        </div>
        <FontAwesomeIcon icon={faLightbulb} className="icon-light" bounce />
        <FontAwesomeIcon icon={faUserTie} className="icon-decider" />
        <div ref={trashRef} className="icon-trash">
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </header>
    </div>
  );
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ items: initialItems, trashRef }) => {
  const [items, setItems] = useState(initialItems);
  const [positions, setPositions] = useState<{ [key: string]: { x: number, y: number } }>({});

  useEffect(() => {
    if (!trashRef.current) {
      console.warn('trashRef is not yet available');
    }
  }, [trashRef]);

  const handleStart: DraggableEventHandler = (e, data) => {
    const id = data.node.id;
    setPositions(prevPositions => ({
      ...prevPositions,
      [id]: { x: data.x, y: data.y }
    }));
  };

  const handleStop: DraggableEventHandler = (e, data) => {
    const trash = trashRef.current;
    if (trash) {
      const trashRect = trash.getBoundingClientRect();
      const draggedElement = data.node as HTMLElement;
      const draggedRect = draggedElement.getBoundingClientRect();

      if (
        draggedRect.right > trashRect.left &&
        draggedRect.left < trashRect.right &&
        draggedRect.bottom > trashRect.top &&
        draggedRect.top < trashRect.bottom
      ) {
        // アイテムを削除
        setItems(prevItems => prevItems.filter(item => item.id !== data.node.id));
      } else {
        // ゴミ箱にドロップされなかった場合は元の位置に戻す
        const id = data.node.id;
        setPositions(prevPositions => ({
          ...prevPositions,
          [id]: { x: prevPositions[id].x, y: prevPositions[id].y }
        }));
      }
    }
  };

  return (
    <>
      {items.map(item => (
        <Draggable
          key={item.id}
          position={positions[item.id] || { x: 0, y: 0 }}
          onStart={handleStart}
          onStop={handleStop}
        >
          <div
            id={item.id}
            style={{ cursor: 'grab' }}
            className="floating-bubble"
          >
            {item.content}
          </div>
        </Draggable>
      ))}
    </>
  );
};

export default App;
