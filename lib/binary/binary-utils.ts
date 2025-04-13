import { RefObject } from 'react';
import type {
    IOrientaion,
    NodeProperty,
    PanelNodeInstance,
    SplitNodeInstance,
} from './binary-node';
import { PanelNode, SplitNode } from './binary-node';

interface CalculateWidthAndHeightReturnValue {
    leftOrUpChildren: {
        width: number;
        height: number;
    };
    rightOrDownChildren: {
        width: number;
        height: number;
    };
}

const calculateWidthAndHeight = ({
    width,
    height,
    orientation,
    ratio,
}: {
    width: number;
    height: number;
    ratio: number;
    orientation: IOrientaion;
}): CalculateWidthAndHeightReturnValue => {
    let tempRadio = ratio;
    if (ratio <= 0.2) {
        tempRadio = 0.2;
    }
    if (ratio >= 0.8) {
        tempRadio = 0.8;
    }

    const leftOrUpChildren = {
        width: orientation === 'horizontality' ? width : width * tempRadio,
        height: orientation === 'horizontality' ? height * tempRadio : height,
    };
    const rightOrDownChildren = {
        width:
            orientation === 'horizontality'
                ? width
                : width - leftOrUpChildren.width,
        height:
            orientation === 'horizontality'
                ? height - leftOrUpChildren.height
                : height,
    };

    return {
        leftOrUpChildren,
        rightOrDownChildren,
    };
};

const makeNode = (
    nodeQuery: NodeProperty
): PanelNodeInstance | SplitNodeInstance => {
    if (nodeQuery.type === 'panel') {
        return new PanelNode(nodeQuery);
    }

    return new SplitNode({
        id: nodeQuery.id,
        orientation: nodeQuery.orientation,
        ratio: nodeQuery.ratio,
    });
};

type MakeLevelOfTreeReturnValue = {
    left: PanelNodeInstance | SplitNodeInstance;
    right: PanelNodeInstance | SplitNodeInstance;
};
const makeLevelOfTree = (
    leftNodeQuery: NodeProperty,
    rightNodeQuery: NodeProperty
): MakeLevelOfTreeReturnValue => {
    const leftNode = makeNode(leftNodeQuery);
    const rightNode = makeNode(rightNodeQuery);

    return {
        left: leftNode,
        right: rightNode,
    };
};

type CalculateQuadrantProps = {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
};
const calculateQuadrantPosition = ({
    currentX,
    currentY,
    startX,
    startY,
}: CalculateQuadrantProps) => {
    const WIDTH = 288;
    const HEIGHT = 288;

    const inclineY = Math.round(
        ((startX - currentX) * HEIGHT) / WIDTH + startY + HEIGHT
    );
    const declineY = Math.round(
        ((currentX - startX) * HEIGHT) / WIDTH + startY
    );

    // console.log(`inc:${inclineY}, dec:${declineY},cur:${currentY}`);
    if (currentY <= inclineY && currentY <= declineY) return '상';
    if (currentY <= inclineY && currentY >= declineY) return '좌';
    if (currentY >= inclineY && currentY <= declineY) return '우';
    return '하';
};

const displayShadowInDroppable = (
    position: string,
    ref: RefObject<HTMLDivElement>
) => {
    let shadow: string;
    switch (position) {
        case '상':
            shadow = '0px -10px 10px rgba(0, 0, 0, 1)';
            break;
        case '좌':
            shadow = '-10px 0px 10px rgba(0, 0, 0, 1)';
            break;
        case '우':
            shadow = '10px 0px 10px rgba(0, 0, 0, 1)';
            break;
        default:
            shadow = '0px 10px 10px rgba(0, 0, 0, 1)';
    }
    ref.current?.style.setProperty('box-shadow', shadow);
};

export {
    makeLevelOfTree,
    calculateWidthAndHeight,
    calculateQuadrantPosition,
    displayShadowInDroppable,
};
