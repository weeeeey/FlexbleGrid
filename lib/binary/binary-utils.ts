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

export { makeLevelOfTree, calculateWidthAndHeight };
