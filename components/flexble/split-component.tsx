import { RefObject, useMemo } from 'react';

interface SplitComponentProps {
    width: number;
    height: number;
    top: number;
    left: number;
    childrenRef: RefObject<HTMLDivElement>;
}

function SplitComponent({
    childrenRef,
    height,
    left,
    top,
    width,
}: SplitComponentProps) {
    const isVertical = useMemo(() => width === 8, [width]);

    return (
        <div
            ref={childrenRef}
            style={{
                width,
                height,
                top,
                left,
            }}
            className={`absolute transition-colors group z-10 ${
                isVertical
                    ? 'hover:cursor-ew-resize py-3'
                    : 'hover:cursor-ns-resize px-3'
            }`}
        >
            <div className="size-full rounded-full from-sky-500  to-white bg-transparent group-hover:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]" />
        </div>
    );
}

export default SplitComponent;
