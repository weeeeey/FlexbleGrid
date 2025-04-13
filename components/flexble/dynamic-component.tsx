import { memo } from 'react';
import AComponent from './a-component';
import BComponent from './b-component';
import CComponent from './c-component';
import DComponent from './d-component';

export type IComponentName =
    | 'AComponent'
    | 'BComponent'
    | 'CComponent'
    | 'DComponent';

interface DynamicComponentProps {
    componentName: IComponentName;
    width: number;
    height: number;
    top: number;
    left: number;
}

const componentMap = {
    AComponent,
    BComponent,
    CComponent,
    DComponent,
};

const DynamicComponent = memo(function C({
    componentName,
    width,
    height,
    top,
    left,
}: DynamicComponentProps) {
    const Component = componentMap[componentName];

    return (
        <div
            className="absolute border border-black p-4"
            style={{
                width,
                height,
                top,
                left,
            }}
        >
            <Component />
        </div>
    );
});

export default DynamicComponent;
