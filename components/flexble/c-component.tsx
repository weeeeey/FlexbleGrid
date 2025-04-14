import { RefObject } from 'react';

function CComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
    console.log('c 리렌더링');
    return (
        <div
            ref={childrenRef}
            className="bg-slate-300 size-full border border-black"
        >
            CComponent
        </div>
    );
}

export default CComponent;
