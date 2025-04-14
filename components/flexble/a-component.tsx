import { RefObject } from 'react';

function AComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
    console.log('a 리렌더링');
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
