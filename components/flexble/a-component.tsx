import { RefObject } from 'react';

function AComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
    return (
        <div
            ref={childrenRef}
            className="bg-green-300 size-full border border-black"
        >
            AComponent
        </div>
    );
}

export default AComponent;
