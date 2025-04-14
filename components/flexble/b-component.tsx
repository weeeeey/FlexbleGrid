import { RefObject } from 'react';

function BComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
    console.log('b 리렌더링');
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
