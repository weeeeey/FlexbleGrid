import { RefObject } from 'react';

function CComponent({
    childrenRef,
}: {
    childrenRef: RefObject<HTMLDivElement>;
}) {
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
