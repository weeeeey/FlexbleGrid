'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

type ItemType = {
    id: number;
    color: string;
    sx: number;
    sy: number;
};
export const dummyItems: ItemType[] = [
    {
        id: 1,
        color: 'bg-red-500',
        sx: 0,
        sy: 0,
    },
    {
        id: 2,
        color: 'bg-orange-500',
        sx: 0,
        sy: 0,
    },
    {
        id: 3,
        color: 'bg-yellow-500',
        sx: 0,
        sy: 0,
    },
    {
        id: 4,
        color: 'bg-green-500',
        sx: 0,
        sy: 0,
    },
    {
        id: 5,
        color: 'bg-blue-500',
        sx: 0,
        sy: 0,
    },
];

type CalculateQuadrantProps = {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
};
const calculateQuadrantPosition = ({
    currentX,
    currentY,
    startX,
    startY,
}: CalculateQuadrantProps) => {
    const WIDTH = 288;
    const HEIGHT = 288;

    const inclineY = Math.round(
        ((startX - currentX) * HEIGHT) / WIDTH + startY + HEIGHT
    );
    const declineY = Math.round(
        ((currentX - startX) * HEIGHT) / WIDTH + startY
    );

    // console.log(`inc:${inclineY}, dec:${declineY},cur:${currentY}`);
    if (currentY <= inclineY && currentY <= declineY) return '상';
    if (currentY <= inclineY && currentY >= declineY) return '좌';
    if (currentY >= inclineY && currentY <= declineY) return '우';
    return '하';
};

const displayShadowInDroppable = (
    position: string,
    ref: RefObject<HTMLDivElement>
) => {
    let shadow: string;
    switch (position) {
        case '상':
            shadow = '0px -10px 10px rgba(0, 0, 0, 1)';
            break;
        case '좌':
            shadow = '-10px 0px 10px rgba(0, 0, 0, 1)';
            break;
        case '우':
            shadow = '10px 0px 10px rgba(0, 0, 0, 1)';
            break;
        default:
            shadow = '0px 10px 10px rgba(0, 0, 0, 1)';
    }
    ref.current?.style.setProperty('box-shadow', shadow);
};

export default function Home() {
    const [items, setItems] = useState(dummyItems);
    const [throttle, setThrottle] = useState(false);
    const currentDraggingItemId = useRef(-1);
    const droppableTagetItemId = useRef(-1);

    const dragStartHandler = (id: number) => {
        currentDraggingItemId.current = id;
    };

    const dragEnterHandler = (targetId: number) => {
        if (currentDraggingItemId.current === targetId) return;
        droppableTagetItemId.current = targetId;
    };

    const dragOverHandler = (
        targetId: number,
        ref: RefObject<HTMLDivElement>,
        calculateProps: CalculateQuadrantProps
    ) => {
        if (targetId === currentDraggingItemId.current) return;
        if (throttle === true) return;
        setThrottle(true);
        setTimeout(() => {
            setThrottle(false);
        }, 500);

        const position = calculateQuadrantPosition(calculateProps);
        displayShadowInDroppable(position, ref);
    };

    const dropHandler = () => {
        if (
            currentDraggingItemId.current === droppableTagetItemId.current ||
            droppableTagetItemId.current === -1
        )
            return;
        const copied = [...items];
        const sourceIndex = copied.findIndex(
            (i) => i.id === currentDraggingItemId.current
        );
        const targetIndex = copied.findIndex(
            (i) => i.id === droppableTagetItemId.current
        );

        [copied[sourceIndex], copied[targetIndex]] = [
            {
                ...copied[targetIndex],
                sx: copied[sourceIndex].sx,
                sy: copied[sourceIndex].sy,
            },
            {
                ...copied[sourceIndex],
                sx: copied[targetIndex].sx,
                sy: copied[targetIndex].sy,
            },
        ];
        setItems(copied);
        currentDraggingItemId.current = -1;
        droppableTagetItemId.current = -1;
    };

    const registerRectangleStartPoint = useCallback(
        (id: number, x: number, y: number) => {
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              sx: x,
                              sy: y,
                          }
                        : item
                )
            );
        },

        []
    );

    return (
        <section className="bg-slate-200  flex flex-col justify-between items-center gap-y-10 py-20">
            {items.map((item) => (
                <Item
                    item={item}
                    onDragStart={dragStartHandler}
                    onDragEnter={dragEnterHandler}
                    onDragOver={dragOverHandler}
                    onDrop={dropHandler}
                    onRegistStartPoint={registerRectangleStartPoint}
                    key={item.id}
                />
            ))}
        </section>
    );
}

interface ItemProps {
    item: ItemType;
    onDragStart: (targetId: number) => void;
    onDragEnter: (targetId: number) => void;
    onDragOver: (
        targetId: number,
        ref: RefObject<HTMLDivElement>,
        calculateProps: CalculateQuadrantProps
    ) => void;
    onRegistStartPoint: (id: number, x: number, y: number) => void;
    onDrop: () => void;
}

function Item({
    item,
    onDrop,
    onDragStart,
    onDragEnter,
    onDragOver,
    onRegistStartPoint,
}: ItemProps) {
    const rectangleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (rectangleRef.current) {
            const { x, y } = rectangleRef.current.getBoundingClientRect();
            const [sx, sy] = [x + window.scrollX, y + window.scrollY];
            onRegistStartPoint(item.id, sx, sy);
        }
    }, [onRegistStartPoint, item.id]);

    return (
        <div
            ref={rectangleRef}
            draggable
            onDragStart={() => onDragStart(item.id)}
            onDragEnter={() => onDragEnter(item.id)}
            onDragOver={(e) => {
                e.preventDefault();
                const [currentX, currentY] = [e.pageX, e.pageY];
                onDragOver(item.id, rectangleRef, {
                    startX: item.sx,
                    startY: item.sy,
                    currentX,
                    currentY,
                });
            }}
            onDrop={(e) => {
                onDrop();
                e.currentTarget.style.setProperty('box-shadow', 'none');
            }}
            className={`size-72 ${item.color} relative overflow-hidden `}
        >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-[2px] h-[150%] bg-black rotate-45 origin-top-left" />
                <div className="absolute top-0 left-0 w-[2px] h-[150%] bg-black -rotate-45 origin-top-left" />
            </div>
        </div>
    );
}
