import { BinaryTreeInstance } from '@/lib/binary/binary-tree';
import {
    calculateQuadrantPosition,
    displayShadowInDroppable,
    type CalculateQuadrantProps,
} from '@/lib/binary/binary-utils';
import { RefObject, useCallback, useMemo, useRef, useState } from 'react';

export type ReturnTypeDragNDrop = ReturnType<typeof useDragNdrop>;

const useDragNdrop = (layoutTree: BinaryTreeInstance | undefined) => {
    const [throttle, setThrottle] = useState(false);
    const currentDraggingItemId = useRef('-1');
    const droppableTagetItemId = useRef('-1');

    const dragStartHandler = (id: string) => {
        currentDraggingItemId.current = id;
    };

    const dragEnterHandler = (targetId: string) => {
        if (currentDraggingItemId.current === targetId) return;
        droppableTagetItemId.current = targetId;
    };

    const dragOverHandler = (
        targetId: string,
        ref: RefObject<HTMLDivElement>,
        calculateProps: CalculateQuadrantProps
    ) => {
        if (targetId === currentDraggingItemId.current) return;
        if (throttle === true) return;
        setThrottle(true);
        setTimeout(() => {
            setThrottle(false);
        }, 800);

        const position = calculateQuadrantPosition(calculateProps);
        displayShadowInDroppable(position, ref);
    };

    const dragLeaveHandler = (
        currentId: string,
        ref: RefObject<HTMLDivElement>
    ) => {
        if (currentId !== droppableTagetItemId.current) {
            ref.current?.style.setProperty('box-shadow', 'none');
        }
    };

    const dropHandler = () => {
        if (
            currentDraggingItemId.current === droppableTagetItemId.current ||
            droppableTagetItemId.current === '-1'
        )
            return;
        // layoutTree.movePannelNode(
        //     currentDraggingItemId.current,
        //     droppableTagetItemId.current
        // );
        console.log(layoutTree);

        currentDraggingItemId.current = '-1';
        droppableTagetItemId.current = '-1';
    };

    const stableDragStartHandler = useCallback(dragStartHandler, []);
    const stableDragEnterHandler = useCallback(dragEnterHandler, []);
    const stableDragLeaveHandler = useCallback(dragLeaveHandler, []);
    const stableDragOverHandler = useCallback(dragOverHandler, [throttle]);
    const stableDropHandler = useCallback(dropHandler, [layoutTree]);

    return useMemo(
        () => ({
            dragStartHandler: stableDragStartHandler,
            dragEnterHandler: stableDragEnterHandler,
            dragLeaveHandler: stableDragLeaveHandler,
            dragOverHandler: stableDragOverHandler,
            dropHandler: stableDropHandler,
        }),
        [
            stableDragStartHandler,
            stableDragEnterHandler,
            stableDragLeaveHandler,
            stableDragOverHandler,
            stableDropHandler,
        ]
    );
};

export default useDragNdrop;
