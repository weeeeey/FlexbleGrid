import type { CommonComponentProps } from './dynamic-component';

function AComponent({ width, height, top, left }: CommonComponentProps) {
    console.log('a 리렌더링');
    return (
        <div
            className="bg-black absolute"
            style={{
                width,
                height,
                top,
                left,
            }}
        >
            AComponent
        </div>
    );
}

export default AComponent;
