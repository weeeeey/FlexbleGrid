import { RefObject } from 'react';

function DComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
    console.log('d 리렌더링');
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
