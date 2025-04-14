import { SplitNode } from '@/lib/binary/binary-node';
import { useEffect, useState } from 'react';
import BinaryTree from '@/lib/binary/binary-tree';

const useFlexibleLayout = () => {
    const [layoutTree, setLayoutTree] = useState<BinaryTree>();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setLayoutTree(() => {
            const rootSplit = new SplitNode({
                id: '0',
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

    return layoutTree;
};

export default useFlexibleLayout;
