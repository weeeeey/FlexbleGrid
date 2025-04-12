import { CommonComponentProps } from './dynamic-component';

function BComponent({ width, height, left, top }: CommonComponentProps) {
    console.log('b 리렌더링');
    return (
        <div
            className="bg-blue-400 absolute"
            style={{
                width,
                height,
                left,
                top,
            }}
        >
            BComponent
        </div>
    );
}

export default BComponent;
