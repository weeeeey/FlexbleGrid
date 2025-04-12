import { memo } from 'react';
import AComponent from './a-component';
import BComponent from './b-component';

export type IComponentName = 'AComponent' | 'BComponent';

interface DynamicComponentProps {
    componentName: IComponentName;
    width: number;
    height: number;
    top: number;
    left: number;
}
export type CommonComponentProps = Omit<DynamicComponentProps, 'componentName'>;

const componentMap = {
    AComponent,
    BComponent,
};

const DynamicComponent = memo(function C({
    componentName,
    width,
    height,
    top,
    left,
}: DynamicComponentProps) {
    const Component = componentMap[componentName];

    if (!Component) {
        console.warn(`컴포넌트 "${componentName}"가 존재하지 않습니다.`);
        return null;
    }

    // 컴포넌트 렌더링
    return <Component top={top} left={left} width={width} height={height} />;
});

export default DynamicComponent;
