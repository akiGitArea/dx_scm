import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsSpin,
  faUserTie,
  faChartPie,
  faChartLine,
  faChartColumn,
  faLightbulb,
  faCircleNotch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./FloatingBubble.css";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { useSpring, animated } from "@react-spring/web";

interface FloatingBubbleProps {
  items: {
    id: string;
    content: string;
  }[];
  trashRef: React.RefObject<HTMLDivElement>;
}

function App() {
  const trashRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [ballStyle, api] = useSpring(() => ({
    transform: "translate(0px, 0px)",
    opacity: 0,
  }));

  const moveBall = () => {
    if (!fromRef.current || !toRef.current) return;
    const fromRect = fromRef.current.getBoundingClientRect();
    const toRect = toRef.current.getBoundingClientRect();
    api.start({
      from: {
        transform: `translate(${fromRect.left}px, ${fromRect.top}px)`,
        // opacity: 1, // 移動開始時に表示
      },
      to: async (next) => {
        // 移動の前半でフェードインを維持
        await next({
          transform: `translate(${(fromRect.left + toRect.left) / 2}px, ${
            (fromRect.top + toRect.top) / 2
          }px)`,
          opacity: 0.8,
          config: { duration: 500 }, // 前半の移動時間
        });
        // 後半でフェードアウトを開始
        await next({
          transform: `translate(${toRect.left}px, ${toRect.top}px)`,
          opacity: 0, // フェードアウト
          config: { duration: 500 }, // 後半の移動時間
        });
      },
      config: { tension: 50, friction: 20, precision: 0.1 },
    });
  };

  return (
    <div className="App">
      <div id="center-logo-content">
        <FontAwesomeIcon icon={faArrowsSpin} id="center-logo" />
      </div>
      <div id="worries-contents">
        <div id="worries">
          <div onClick={moveBall}>
            <FloatingBubble
              items={[{ id: "worry1", content: "worry1" }]}
              trashRef={trashRef}
            />
          </div>
          <div id="user-contents" ref={fromRef}>
            <div id="icon-user-set">
              <FontAwesomeIcon icon={faUserTie} id="icon-user" />
              <FontAwesomeIcon icon={faCircleNotch} id="icon-loading" spin />
            </div>
          </div>
        </div>
      </div>
      <div id="indexes-contents">
        <div id="indexes" ref={toRef}>
          {/* <FloatingBubble
            items={[{ id: "index1", content: "index" }]}
            trashRef={trashRef}
          /> */}
          <FontAwesomeIcon icon={faChartPie} id="icon-index-pie" />
          <FontAwesomeIcon icon={faChartLine} id="icon-index-line" />
          <FontAwesomeIcon icon={faChartColumn} id="icon-index-column" />
          <p id="icon-index-ai">AI</p>
        </div>
      </div>
      <div id="innovation-contents">
        <div id="innovation">
          {/* <FloatingBubble
            items={[{ id: "innovation1", content: "innovation" }]}
            trashRef={trashRef}
          /> */}
          <div id="decider-contents">
            <div id="icon-decider-set">
              <FontAwesomeIcon icon={faUserTie} id="icon-decider" />
              <FontAwesomeIcon icon={faLightbulb} id="icon-light" bounce />
            </div>
          </div>
        </div>
      </div>
      <div ref={trashRef} id="icon-trash">
        <FontAwesomeIcon icon={faTrash} />
      </div>
      <animated.div
        id="move-ball"
        style={{
          ...ballStyle,
        }}
      />
    </div>
  );
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({
  items: initialItems,
  trashRef,
}) => {
  const [items, setItems] = useState(initialItems);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  useEffect(() => {
    if (!trashRef.current) {
      console.warn("trashRef is not yet available");
    }
  }, [trashRef]);

  const handleStart: DraggableEventHandler = (e, data) => {
    const id = data.node.id;
    setPositions((prevPositions) => ({
      ...prevPositions,
      [id]: { x: data.x, y: data.y },
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
        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== data.node.id)
        );
      } else {
        // ゴミ箱にドロップされなかった場合は元の位置に戻す
        const id = data.node.id;
        setPositions((prevPositions) => ({
          ...prevPositions,
          [id]: { x: prevPositions[id].x, y: prevPositions[id].y },
        }));
      }
    }
  };

  return (
    <>
      {items.map((item) => (
        <Draggable
          key={item.id}
          position={positions[item.id] || { x: 0, y: 0 }}
          onStart={handleStart}
          onStop={handleStop}
        >
          <div
            id={item.id}
            style={{ cursor: "grab" }}
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
