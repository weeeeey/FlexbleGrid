'use client';

import DynamicComponent from '@/components/flexble/dynamic-component';
import useDragNdrop from '@/hooks/use-dragNdrop';
import useFlexibleLayout from '@/hooks/use-flexible-layout';

function PageComponent() {
    const { componentsToRender, replacePlaceOfNodes } = useFlexibleLayout();

    const dragNDropMethod = useDragNdrop(replacePlaceOfNodes);

    return (
        <div className="flex flex-col items-center justify-center gap-10 relative">
            {componentsToRender?.map((c) => (
                <DynamicComponent
                    key={c.id}
                    sectionDate={c}
                    dragNDropMethod={dragNDropMethod}
                />
            ))}
        </div>
    );
}

export default PageComponent;
