import { IComponentName } from '@/components/flexble/dynamic-component';
import {
    ILayoutNode,
    IOrientaion,
    SplitNode,
    SplitNodeInstance,
} from './binary-node';
import {
    calculateWidthAndHeight,
    IPosition,
    makeLevelOfTree,
} from './binary-utils';

const initialTreeComposition = [
    makeLevelOfTree(
        {
            id: 'a component',
            type: 'panel',
            componentName: 'AComponent',
        },
        {
            id: '두번째 분할',
            type: 'split',
            orientation: 'horizontality',
            ratio: 0.5,
            left: null,
            right: null,
        }
    ),
    makeLevelOfTree(
        {
            id: 'b component',
            type: 'panel',
            componentName: 'BComponent',
        },
        {
            id: '세번째 분할',
            type: 'split',
            orientation: 'verticality',
            ratio: 0.3,
            left: null,
            right: null,
        }
    ),
    makeLevelOfTree(
        {
            id: 'c component',
            type: 'panel',
            componentName: 'CComponent',
        },
        {
            id: 'd component',
            type: 'panel',
            componentName: 'DComponent',
        }
    ),
];

export type IWillRenderComponent = {
    id: string;
    top: number;
    left: number;
    width: number;
    height: number;
    componentName: IComponentName;
};

export type BinaryTreeInstance = InstanceType<typeof BinaryTree>;

class BinaryTree {
    private root: SplitNodeInstance;
    private width: number;
    private height: number;

    constructor(splitNode: SplitNodeInstance, width: number, height: number) {
        this.root = splitNode;
        this.width = width < 375 ? 375 : width;
        this.height = height < 667 ? 667 : height;
    }

    appenNodeInTree(
        parent: SplitNodeInstance,
        children: ILayoutNode,
        direction: 'left' | 'right'
    ) {
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

        this.appenNodeInTree(
            first.right as SplitNodeInstance,
            second.left,
            'left'
        );
        this.appenNodeInTree(
            first.right as SplitNodeInstance,
            second.right,
            'right'
        );

        this.appenNodeInTree(
            second.right as SplitNodeInstance,
            third.left,
            'left'
        );
        this.appenNodeInTree(
            second.right as SplitNodeInstance,
            third.right,
            'right'
        );
    }
    replaceRoot(splitNode: SplitNodeInstance) {
        this.root = splitNode;
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
            height: number,
            top: number,
            left: number
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
                    leftOrUpChildren.height,
                    top,
                    left
                );
                visitChildren(
                    node.getChildren('right')!,
                    rightOrDownChildren.width,
                    rightOrDownChildren.height,
                    node.orientation === 'verticality'
                        ? top
                        : top + leftOrUpChildren.height,
                    node.orientation === 'verticality'
                        ? left + leftOrUpChildren.width
                        : left
                );
            } else {
                willRenderComponents.push({
                    id: node.id,
                    componentName: node.componentName,
                    height,
                    width,
                    top,
                    left,
                });
            }
        };

        visitChildren(
            this.root.getChildren('left')!,
            leftOrUpChildren.width,
            leftOrUpChildren.height,
            0,
            0
        );
        visitChildren(
            this.root.getChildren('right')!,
            rightOrDownChildren.width,
            rightOrDownChildren.height,
            this.root.orientation === 'verticality'
                ? 0
                : leftOrUpChildren.height,
            this.root.orientation === 'verticality' ? leftOrUpChildren.width : 0
        );

        return willRenderComponents;
    }

    findParentOfNode(nodeId: string) {
        const q: ILayoutNode[] = [this.root];
        while (q.length) {
            const currentNode = q.shift();
            if (!currentNode || currentNode.type === 'panel') continue;
            const leftNode = currentNode.getChildren('left')!;
            const rightNode = currentNode.getChildren('right')!;
            if (leftNode.id === nodeId) return currentNode;
            if (rightNode.id === nodeId) return currentNode;
            q.push(leftNode);
            q.push(rightNode);
        }
    }

    connectSiblingToGrandparent(
        parentNode: ILayoutNode,
        siblingNode: ILayoutNode
    ) {
        if (parentNode === this.root) {
            this.replaceRoot(siblingNode as SplitNodeInstance);
            return;
        }
        const grandParent = this.findParentOfNode(parentNode.id)!;

        if (grandParent.getChildren('left')?.id === parentNode.id) {
            grandParent.appendNode('left', siblingNode);
        } else {
            grandParent.appendNode('right', siblingNode);
        }
    }

    findSiblingNode(parentNode: SplitNodeInstance, panelId: string) {
        const left = parentNode.getChildren('left');
        if (left?.id === panelId) return parentNode.getChildren('right');
        return left;
    }

    findPanelNode(panelId: string) {
        const q: ILayoutNode[] = [this.root];
        while (q.length) {
            const currentNode = q.shift();
            if (!currentNode) continue;
            if (currentNode.type === 'panel') {
                if (currentNode.id === panelId) return currentNode;
                continue;
            }
            const leftNode = currentNode.getChildren('left')!;
            const rightNode = currentNode.getChildren('right')!;
            q.push(leftNode);
            q.push(rightNode);
        }
    }

    positionNodes(
        position: IPosition,
        parent: SplitNodeInstance,
        source: ILayoutNode,
        destiny: ILayoutNode
    ) {
        const isSourceLeftOrUpSide = ['상', '좌'].includes(position);
        if (isSourceLeftOrUpSide === true) {
            parent.appendNode('left', source);
            parent.appendNode('right', destiny);
        } else {
            parent.appendNode('right', source);
            parent.appendNode('left', destiny);
        }
    }

    movePannelNode({
        destinyId,
        position,
        sourceId,
    }: {
        sourceId: string;
        destinyId: string;
        position: IPosition;
    }) {
        const orientation: IOrientaion = ['상', '하'].includes(position)
            ? 'horizontality'
            : 'verticality';

        const sourceNode = this.findPanelNode(sourceId)!;
        const destinyNode = this.findPanelNode(destinyId)!;

        const parentOfSource = this.findParentOfNode(sourceId)!;
        const parentOfDestiny = this.findParentOfNode(destinyId)!;

        if (parentOfDestiny.id === parentOfSource.id) {
            if (parentOfDestiny.orientation !== orientation) {
                parentOfSource.toggleOrientation();
            }

            this.positionNodes(
                position,
                parentOfSource,
                sourceNode,
                destinyNode
            );
        } else {
            const siblingOfSource = this.findSiblingNode(
                parentOfSource,
                sourceId
            )!;

            this.connectSiblingToGrandparent(parentOfSource, siblingOfSource);

            const newSplitNode = new SplitNode({
                id: String(Math.random() * 10000),
                orientation,
                ratio: 0.5,
            });
            this.positionNodes(position, newSplitNode, sourceNode, destinyNode);

            if (parentOfDestiny.getChildren('left')!.id === destinyId) {
                parentOfDestiny.appendNode('left', newSplitNode);
            } else {
                parentOfDestiny.appendNode('right', newSplitNode);
            }
        }
    }
    diffReplace(newTree: BinaryTreeInstance) {
        const q: [ILayoutNode, ILayoutNode][] = [[this.root, newTree.root]];
        while (q.length) {
            const popArray = q.shift();
            if (popArray === undefined) continue;
            const [prevNode, newNode] = popArray;
            if (prevNode.id !== newNode.id) {
                const parentOfPrevNode = this.findParentOfNode(prevNode.id)!;
                if (parentOfPrevNode.getChildren('left')!.id === prevNode.id) {
                    parentOfPrevNode.appendNode('left', newNode);
                } else {
                    parentOfPrevNode.appendNode('right', newNode);
                }
            } else {
                if (prevNode.type === 'panel' || newNode.type === 'panel')
                    continue;
                const [nextLeftPrev, nextLeftNew] = [
                    prevNode.getChildren('left')!,
                    newNode.getChildren('left')!,
                ];
                const [nextRightPrev, nextRightNew] = [
                    prevNode.getChildren('right')!,
                    newNode.getChildren('right')!,
                ];
                q.push([nextLeftPrev, nextLeftNew]);
                q.push([nextRightPrev, nextRightNew]);
            }
        }
    }
}

export default BinaryTree;
