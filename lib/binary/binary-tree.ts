import { IComponentName } from '@/components/flexble/dynamic-component';
import { ILayoutNode, SplitNodeInstance } from './binary-node';
import { calculateWidthAndHeight, makeLevelOfTree } from './binary-utils';

const initialTreeComposition = [
    makeLevelOfTree(
        {
            id: '11111',
            type: 'panel',
            componentName: 'AComponent',
        },
        {
            id: '10',
            type: 'split',
            orientation: 'horizontality',
            ratio: 0.5,
            left: null,
            right: null,
        }
    ),
    makeLevelOfTree(
        {
            id: '1',
            type: 'panel',
            componentName: 'BComponent',
        },
        {
            id: '11',
            type: 'split',
            orientation: 'verticality',
            ratio: 0.5,
            left: null,
            right: null,
        }
    ),
    makeLevelOfTree(
        {
            id: '2',
            type: 'panel',
            componentName: 'AComponent',
        },
        {
            id: '3',
            type: 'panel',
            componentName: 'BComponent',
        }
    ),
];

export type IWillRenderComponent = {
    id: string;
    left: number;
    right: number;
    width: number;
    height: number;
    componentName: IComponentName;
};

class BinaryTree {
    private root: SplitNodeInstance;
    private width: number;
    private height: number;

    constructor(splitNode: SplitNodeInstance, width: number, height: number) {
        this.root = splitNode;
        this.width = width;
        this.height = height;
    }

    appenNodeInTree(
        parent: ILayoutNode,
        children: ILayoutNode,
        direction: 'left' | 'right'
    ) {
        if (parent.type === 'panel') {
            throw new Error('패널 노드에는 자식이 붙을 수 없다.');
        }
        if (direction === 'left') {
            parent.appendNode('left', children);
        } else {
            parent.appendNode('right', children);
        }
    }

    init() {
        const [first, second, third] = initialTreeComposition;
        this.appenNodeInTree(this.root, first.left, 'left');
        this.appenNodeInTree(this.root, first.right, 'right');

        this.appenNodeInTree(first.right, second.left, 'left');
        this.appenNodeInTree(first.right, second.right, 'right');

        this.appenNodeInTree(second.right, third.left, 'left');
        this.appenNodeInTree(second.right, third.right, 'right');
    }

    getSize() {
        return {
            width: this.width,
            height: this.height,
        };
    }
    getTree() {
        return this.root;
    }

    search() {
        const { leftOrUpChildren, rightOrDownChildren } =
            calculateWidthAndHeight({
                width: this.width,
                height: this.height,
                ratio: this.root.ratio,
                orientation: this.root.orientation,
            });
        const willRenderComponents: IWillRenderComponent[] = [];

        const visitChildren = (
            node: ILayoutNode,
            width: number,
            height: number
        ) => {
            if (node.type === 'split') {
                const { leftOrUpChildren, rightOrDownChildren } =
                    calculateWidthAndHeight({
                        width,
                        height,
                        ratio: node.ratio,
                        orientation: node.orientation,
                    });
                visitChildren(
                    node.getChildren('left')!,
                    leftOrUpChildren.width,
                    leftOrUpChildren.height
                );
                visitChildren(
                    node.getChildren('right')!,
                    rightOrDownChildren.width,
                    rightOrDownChildren.height
                );
            } else {
                willRenderComponents.push({
                    id: node.id,
                    componentName: node.componentName,
                    height,
                    width,
                    left: 0,
                    right: 0,
                });
            }
        };

        visitChildren(
            this.root.getChildren('left')!,
            leftOrUpChildren.width,
            leftOrUpChildren.height
        );
        visitChildren(
            this.root.getChildren('right')!,
            rightOrDownChildren.width,
            rightOrDownChildren.height
        );

        return willRenderComponents;
    }
}

export default BinaryTree;
