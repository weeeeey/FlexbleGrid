import { RefObject } from 'react';

function DComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
    return (
        <div
            ref={childrenRef}
            className="bg-red-300 size-full border border-black"
        >
            DComponent
        </div>
    );
}

export default DComponent;
