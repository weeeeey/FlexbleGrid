import { memo, useRef } from 'react';
import AComponent from './a-component';
import BComponent from './b-component';
import CComponent from './c-component';
import DComponent from './d-component';
import { IWillRenderComponent } from '@/lib/binary/binary-tree';
import { ReturnTypeDragNDrop } from '@/hooks/use-dragNdrop';

export type IComponentName =
    | 'AComponent'
    | 'BComponent'
    | 'CComponent'
    | 'DComponent';

interface DynamicComponentProps {
    sectionDate: IWillRenderComponent;
    dragNDropMethod: ReturnTypeDragNDrop;
}

const componentMap = {
    AComponent,
    BComponent,
    CComponent,
    DComponent,
};

const DynamicComponent = memo(function C({
    sectionDate,
    dragNDropMethod,
}: DynamicComponentProps) {
    const { componentName, height, id, left, top, width } = sectionDate;
    // console.log(componentName);
    const {
        dragStartHandler,
        dragEnterHandler,
        dragLeaveHandler,
        dragOverHandler,
        dropHandler,
    } = dragNDropMethod;
    const sectionRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);

    const Component = componentMap[componentName];
    return (
        <div
            ref={sectionRef}
            draggable
            onDragStart={() => dragStartHandler(id)}
            onDragEnter={() => dragEnterHandler(id)}
            onDragLeave={() => dragLeaveHandler(childrenRef)}
            onDragOver={(e) => {
                e.preventDefault();
                const [currentX, currentY] = [e.pageX, e.pageY];
                dragOverHandler(id, childrenRef, {
                    startX: left,
                    startY: top,
                    currentX,
                    currentY,
                    width,
                    height,
                });
            }}
            onDrop={() => dropHandler(childrenRef)}
            className="absolute border border-black p-4"
            style={{
                width,
                height,
                top,
                left,
            }}
        >
            <Component childrenRef={childrenRef} />
        </div>
    );
});

export default DynamicComponent;
