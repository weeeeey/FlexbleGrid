import { RefObject } from 'react';

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
    return (
        <div
            ref={childrenRef}
            className="absolute bg-black"
            style={{
                width,
                height,
                top,
                left,
            }}
        />
    );
}

export default SplitComponent;
