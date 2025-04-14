import { RefObject } from 'react';

function BComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
    return (
        <div
            ref={childrenRef}
            className="bg-blue-300 size-full border border-black"
        >
            BComponent
        </div>
    );
}

export default BComponent;
