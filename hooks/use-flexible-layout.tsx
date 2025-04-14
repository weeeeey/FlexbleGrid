import { SplitNode } from '@/lib/binary/binary-node';
import { useCallback, useEffect, useState } from 'react';
import BinaryTree from '@/lib/binary/binary-tree';
import { IPosition } from '@/lib/binary/binary-utils';

const useFlexibleLayout = () => {
    const [layoutTree, setLayoutTree] = useState<BinaryTree>();

    const replacePlaceOfNodes = useCallback(
        (sourceId: string, destinyId: string, position: IPosition) => {
            setLayoutTree((tree) => {
                const { height, width } = tree!.getSize();
                const newTree = new BinaryTree(tree!.getTree(), width, height);
                newTree.movePannelNode({
                    sourceId,
                    destinyId,
                    position,
                });
                return newTree;
            });
        },
        []
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setLayoutTree(() => {
            const rootSplit = new SplitNode({
                id: '첫번쨰 분할',
                orientation: 'verticality',
                ratio: 0.5,
            });
            const tree = new BinaryTree(
                rootSplit,
                window.innerWidth,
                window.innerHeight
            );
            tree.init();
            return tree;
        });
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResizeEvent = (e: UIEvent) => {
            const target = e.currentTarget as Window;

            const { innerWidth, innerHeight } = target;
            setLayoutTree((tree) => {
                const newTree = new BinaryTree(
                    tree!.getTree(),
                    innerWidth,
                    innerHeight
                );
                return newTree;
            });
        };

        window.addEventListener('resize', handleResizeEvent);
        return () => window.removeEventListener('resize', handleResizeEvent);
    }, []);

    return { layoutTree, replacePlaceOfNodes };
};

export default useFlexibleLayout;
