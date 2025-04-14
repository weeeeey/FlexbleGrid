import { IComponentName } from '@/components/flexble/dynamic-component';

export type ILayoutNode = PanelNodeInstance | SplitNodeInstance;
export type NodeProperty = PanelNodeProperty | SplitNodeProperty;

export type IType = 'panel' | 'split';
export type IOrientaion = 'verticality' | 'horizontality';

export interface IPanelNode {
    id: string;
    type: 'panel';
    componentName: IComponentName;
}

export interface ISplitNode {
    type: 'split';
    id: string;
    ratio: number;
    orientation: IOrientaion;
    left: ILayoutNode | null;
    right: ILayoutNode | null;
}

export type PanelNodeInstance = InstanceType<typeof PanelNode>;
export type PanelNodeProperty = {
    id: string;
    type: 'panel';
    componentName: IComponentName;
};

export class PanelNode implements IPanelNode {
    id: string;
    type: 'panel';
    componentName;
    constructor({
        id,
        componentName,
    }: {
        id: string;
        componentName: IComponentName;
    }) {
        this.id = id;
        this.type = 'panel';
        this.componentName = componentName;
    }
}

export type SplitNodeInstance = InstanceType<typeof SplitNode>;
export type SplitNodeProperty = {
    id: string;
    type: 'split';
    ratio: number;
    left: ILayoutNode | null;
    right: ILayoutNode | null;
    orientation: IOrientaion;
};
export class SplitNode {
    id;
    type: 'split';
    ratio;
    private left: ILayoutNode | null;
    private right: ILayoutNode | null;
    orientation;

    constructor({
        id,
        ratio,
        orientation,
    }: Omit<ISplitNode, 'type' | 'left' | 'right'>) {
        this.id = id;
        this.type = 'split';
        this.ratio = ratio;
        this.orientation = orientation;
        this.left = null;
        this.right = null;
    }

    getChildren(direction: 'left' | 'right') {
        if (direction === 'left') return this.left;
        return this.right;
    }

    toggleOrientation() {
        this.orientation =
            this.orientation === 'horizontality'
                ? 'verticality'
                : 'horizontality';
    }
    changeRatio(value: number) {
        let tempValue = value;
        if (value <= 0.2) tempValue = 0.2;
        if (value >= 0.8) tempValue = 0.8;
        this.ratio = tempValue;
    }

    appendNode(direction: 'left' | 'right', node: ILayoutNode) {
        if (direction === 'left') {
            this.left = node;
        } else {
            this.right = node;
        }
    }
}
