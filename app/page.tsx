'use client';

import DynamicComponent from '@/components/flexble/dynamic-component';
import { SplitNode } from '@/lib/binary/binary-node';
import BinaryTree, { IWillRenderComponent } from '@/lib/binary/binary-tree';
import { useEffect, useState } from 'react';

const WIDTH = 1470;
const HEIGHT = 798;

function Page() {
    const [layoutTree, setLayoutTree] = useState(() => {
        const rootSplit = new SplitNode({
            id: '0',
            orientation: 'verticality',
            ratio: 0.5,
        });
        const tree = new BinaryTree(rootSplit, WIDTH, HEIGHT);
        tree.init();
        return tree;
    });

    useEffect(() => {
        const handleResizeEvent = (e: UIEvent) => {
            const target = e.currentTarget as Window;

            const { innerWidth, innerHeight } = target;
            setLayoutTree((tree) => {
                const newTree = new BinaryTree(
                    tree.getTree(),
                    innerWidth,
                    innerHeight
                );
                return newTree;
            });
        };

        window.addEventListener('resize', handleResizeEvent);
        return () => window.removeEventListener('resize', handleResizeEvent);
    }, []);

    useEffect(() => {
        console.log(layoutTree.search());
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-y-10 relative">
            {layoutTree.search().map((c: IWillRenderComponent) => (
                <DynamicComponent
                    key={c.id}
                    componentName={c.componentName}
                    height={c.height}
                    width={c.width}
                    top={c.top}
                    left={c.left}
                />
            ))}
        </div>
    );
}

export default Page;
