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
  faClose
} from "@fortawesome/free-solid-svg-icons";
import "./FloatingBubble.css";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { useSpring, animated } from "@react-spring/web";
import supplierSet from './supplierSet.json';
import manufactureSet from './manufactureSet.json';
import wholesalerSet from './wholesalerSet.json';
import retailerSet from './retailerSet.json';

interface WorrySet {
  id: string;
  worry: string;
  index: string;
  innovation: string;
}

interface FloatingBubbleProps {
  items: {
    id: string;
    content: string;
  }[];
  trashRef: React.RefObject<HTMLDivElement>;
  setWorrySet: React.Dispatch<React.SetStateAction<worrySets>>;
  getRandomItem: () => WorrySet;
  moveBall: (itemId: string) => Promise<void>;
}

type worrySets = WorrySet[];

function App() {
  const trashRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const innovationRef = useRef<HTMLDivElement>(null);
  const [ballStyle, api] = useSpring(() => ({
    transform: "translate(0px, 0px)",
    opacity: 0,
  }));
  const [resultToInnovationBall, ball2] = useSpring(() => ({
    transform: "translate(0px, 0px)",
    opacity: 0,
  }));

  const [indexResult, setIndexResult] = useState<string>("");
  const [innovationIdea, setInnovationIdea] = useState<string>("");
  const [prevWorryId, setPrevWorryId] = useState<string>("");
  const [worrySet, setWorrySet] = useState<worrySets>([]);
  const [clickCount, setClickCount] = useState(0);
  const [lastClicks, setLastClicks] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('option1');
  const [jsonData, setJsonData] = useState<worrySets>(supplierSet);

  const secretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const findIndexById = (id: string, data: WorrySet[]): string => {
    const item = data.find((item) => item.id === id);
    return item ? item.index : "";
  };

  const findInnovationById = (id: string, data: WorrySet[]): string => {
    const item = data.find((item) => item.id === id);
    return item ? item.innovation : "";
  };

  const getRandomItem = (): WorrySet => {
    const newItems = getRandomElements(jsonData, 1);
    return newItems[0];
  };

  const getRandomElements = <T,>(arr: T[], count: number): T[] => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const moveBall = async (itemId: string) => {
    if (!fromRef.current || !toRef.current || !innovationRef.current) return;
    const fromRect = fromRef.current.getBoundingClientRect();
    const toRect = toRef.current.getBoundingClientRect();
    const innovationRect = innovationRef.current.getBoundingClientRect();
    const indexElement = document.getElementById("index-result");
    const innovationElement = document.getElementById("innovation-idea");
    const slectWorryElement = document.getElementById(itemId);
    const prevWorryElement = document.getElementById(prevWorryId);
    if (prevWorryElement) {
      prevWorryElement.style.border = "";
      prevWorryElement.style.animation = "";
    }
    if (indexElement) {
      indexElement.style.display = "none";
    }
    if (innovationElement) {
      innovationElement.style.display = "none";
    }
    if (slectWorryElement) {
      slectWorryElement.style.border = "1px solid";
      slectWorryElement.style.animation = "rainbow-border 3s linear infinite";
    }
    api.start({
      from: {
        transform: `translate(${fromRect.left + (fromRect.width / 2)}px, ${fromRect.top}px)`,
      },
      to: async (next) => {
        await next({
          transform: `translate(${((fromRect.left + (fromRect.width / 2)) + toRect.left) / 2}px, ${(fromRect.top + toRect.bottom) / 2}px)`,
          opacity: 1,
          config: { duration: 1000 },
        });
        await next({
          transform: `translate(${toRect.left}px, ${toRect.bottom}px)`,
          opacity: 0,
          config: { duration: 1000 },
        });
      },
      config: { tension: 50, friction: 20, precision: 0.1 },
    });
    await delay(1000);
    if (indexElement) {
      indexElement.style.display = "block";
    }
    const index = findIndexById(itemId, worrySet);
    setIndexResult(index);
    await delay(1000);
    ball2.start({
      from: {
        transform: `translate(${toRect.right}px, ${toRect.bottom}px)`,
      },
      to: async (next) => {
        await next({
          transform: `translate(${(toRect.right + (innovationRect.left + (fromRect.width / 2))) / 2}px, ${(toRect.bottom + innovationRect.top) / 2}px)`,
          opacity: 1,
          config: { duration: 1000 },
        });
        await next({
          transform: `translate(${innovationRect.left + (fromRect.width / 2)}px, ${innovationRect.top}px)`,
          opacity: 0,
          config: { duration: 1000 },
        });
      },
      config: { tension: 50, friction: 20, precision: 0.1 },
    });
    await delay(1000);
    if (innovationElement) {
      innovationElement.style.display = "block";
    }
    const innovation = findInnovationById(itemId, worrySet);
    setInnovationIdea(innovation);
    setPrevWorryId(itemId);
  };

  const secretClick = () => {
    const now = Date.now();
    setLastClicks(prevClicks => {
      const updatedClicks = [...prevClicks, now];
      const recentClicks = updatedClicks.filter(timestamp => now - timestamp <= 1000);
      setClickCount(recentClicks.length);
      if (recentClicks.length >= 3) {
        document.getElementById("secret-config")!.style.display = "block"
      }
      return recentClicks;
    });
  };

  const closeSecretClick = () => {
    document.getElementById("secret-config")!.style.display = "none"
  };

  useEffect(() => {
    const items = getRandomElements(jsonData, 3);
    setWorrySet(items);
    console.log(items)
    return () => {
      console.log('コンポーネントがアンマウントされました');
    };
  }, [jsonData]);

  useEffect(() => {
    // ラジオボタンの選択に応じてJSONデータを更新
    switch (selectedOption) {
      case 'option1':
        setJsonData(supplierSet);
        break;
      case 'option2':
        setJsonData(manufactureSet);
        break;
      case 'option3':
        setJsonData(wholesalerSet);
        break;
      case 'option4':
        setJsonData(retailerSet);
        break;
      default:
        setJsonData(supplierSet);
    }
  }, [selectedOption]);

  return (
    <div className="App">
      <div id="center-logo-content">
        <FontAwesomeIcon icon={faArrowsSpin} id="center-logo" />
      </div>
      <div id="worries-contents" ref={fromRef}>
        {/* <div id="worries-ball-from"></div> */}
        <div id="worries">
          <div id="worry-set">
            {worrySet.map((item, index) => (
              <div id={`worry-${index}`} key={item.id}>
                <FloatingBubble
                  items={[{ id: item.id, content: item.worry }]}
                  trashRef={trashRef}
                  setWorrySet={setWorrySet}
                  getRandomItem={getRandomItem}
                  moveBall={moveBall}
                />
              </div>
            ))}
          </div>
          <div id="user-contents">
            <div id="icon-user-set">
              <FontAwesomeIcon icon={faUserTie} id="icon-user" />
              <FontAwesomeIcon icon={faCircleNotch} id="icon-loading" spin />
            </div>
          </div>
        </div>
      </div>
      <div id="indexes-contents" ref={toRef}>
        <div id="indexes">
          <div id="index-result">{indexResult}</div>
          <FontAwesomeIcon icon={faChartPie} id="icon-index-pie" />
          <FontAwesomeIcon icon={faChartLine} id="icon-index-line" />
          <FontAwesomeIcon icon={faChartColumn} id="icon-index-column" />
          <p id="icon-index-ai">AI</p>
        </div>
      </div>
      <div id="innovation-contents">
        <div id="innovation" ref={innovationRef}>
          <div id="innovation-idea">{innovationIdea}</div>
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
        style={ballStyle}
      />
      <animated.div
        id="move-ball-result-to-innovation"
        style={resultToInnovationBall}
      />
      <button type="button" id="secret-button" onClick={secretClick} />
      <div id="secret-config" >
        <button id="close-secret-setting-icon" type="button" onClick={closeSecretClick} ><FontAwesomeIcon icon={faClose} /></button>
        <div id="secret-contents" >
          <div><input type="radio" id="option1" name="options" value="option1"
            checked={selectedOption === 'option1'}
            onChange={secretChange} />
            <label htmlFor="option1">供給者（Supplier） - 原材料や部品を提供する企業や個人。</label>
          </div>
          <div><input type="radio" id="option2" name="options" value="option2"
            checked={selectedOption === 'option2'}
            onChange={secretChange} />
            <label htmlFor="option2">製造業者（Manufacturer） - 供給者から原材料を受け取り、製品を製造する企業。</label>
          </div>
          <div><input type="radio" id="option3" name="options" value="option3"
            checked={selectedOption === 'option3'}
            onChange={secretChange} />
            <label htmlFor="option3">卸売業者（Wholesaler） - 製品を大量に仕入れ、小売業者に販売する企業。</label>
          </div>
          <div><input type="radio" id="option4" name="options" value="option4"
            checked={selectedOption === 'option4'}
            onChange={secretChange} />
            <label htmlFor="option4">小売業者（Retailer） - 消費者に直接製品を販売する店舗やオンラインショップ。</label>
          </div>
        </div>
      </div>
    </div>
  );
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({
  items: initialItems,
  trashRef,
  setWorrySet,
  getRandomItem,
  moveBall
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
        const draggedId = data.node.id;
        setItems((prevItems) =>
          prevItems.filter((item) => item.id !== draggedId)
        );

        setWorrySet((prevSet) => {
          const existingIds = new Set(prevSet.map(item => item.id));
          let newItem = getRandomItem();
          while (existingIds.has(newItem.id)) {
            newItem = getRandomItem();
          }
          return [...prevSet.filter(item => item.id !== draggedId), newItem];
        });
      } else {
        const id = data.node.id;
        setPositions((prevPositions) => ({
          ...prevPositions,
          [id]: { x: prevPositions[id].x, y: prevPositions[id].y },
        }));
        moveBall(id)
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
