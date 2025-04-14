import { BinaryTreeInstance } from '@/lib/binary/binary-tree';
import {
    calculateQuadrantPosition,
    displayShadowInDroppable,
    IPosition,
    type CalculateQuadrantProps,
} from '@/lib/binary/binary-utils';
import { RefObject, useCallback, useMemo, useRef, useState } from 'react';

export type ReturnTypeDragNDrop = ReturnType<typeof useDragNdrop>;

const useDragNdrop = (
    layoutTree: BinaryTreeInstance | undefined,
    replaceTree: (
        sourceId: string,
        destinyId: string,
        position: IPosition
    ) => void
) => {
    const [throttle, setThrottle] = useState(false);
    const currentDraggingItemId = useRef('-1');
    const droppableTagetItemId = useRef('-1');
    const dropedPosition = useRef<IPosition | undefined>();

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
        dropedPosition.current = position;
    };

    const dragLeaveHandler = (ref: RefObject<HTMLDivElement>) => {
        ref.current?.style.setProperty('box-shadow', 'none');
    };

    const dropHandler = (ref: RefObject<HTMLDivElement>) => {
        if (
            currentDraggingItemId.current === droppableTagetItemId.current ||
            droppableTagetItemId.current === '-1'
        )
            return;
        ref.current?.style.setProperty('box-shadow', 'none');

        replaceTree(
            currentDraggingItemId.current,
            droppableTagetItemId.current,
            dropedPosition.current!
        );

        currentDraggingItemId.current = '-1';
        droppableTagetItemId.current = '-1';
    };

    const stableDragStartHandler = useCallback(dragStartHandler, []);
    const stableDragEnterHandler = useCallback(dragEnterHandler, []);
    const stableDragLeaveHandler = useCallback(dragLeaveHandler, []);
    const stableDragOverHandler = useCallback(dragOverHandler, [throttle]);
    const stableDropHandler = useCallback(dropHandler, [replaceTree]);

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
