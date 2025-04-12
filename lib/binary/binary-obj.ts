// import { type IComponentName } from '@/components/flexble/dynamic-component';

// type ILayoutNode = IPanelNode | ISplitNode;
// type IOrientaion = 'verticality' | 'horizontality';

// interface IPanelNode {
//     type: 'panel';
//     id: number;
//     componentName: IComponentName;
// }

// interface ISplitNode {
//     type: 'split';
//     id: number;
//     ratio: number;
//     orientation: IOrientaion;
//     left: ILayoutNode | null;
//     right: ILayoutNode | null;
// }

// const pannelNode = ({ id, componentName }: Omit<IPanelNode, 'type'>) => {
//     const type = 'panel';
//     const node: IPanelNode = {
//         id,
//         componentName,
//         type,
//     };

//     const getProperty = (key: keyof IPanelNode) => node[key];

//     return {
//         node,
//         getProperty,
//     };
// };

// const splitNode = ({
//     id,
//     ratio,
//     orientation,
// }: Omit<ISplitNode, 'type' | 'left' | 'right'>) => {
//     const type = 'split';
//     const node: ISplitNode = {
//         id,
//         type,
//         left: null,
//         right: null,
//         ratio,
//         orientation,
//     };
//     const setChildren = (
//         direction: 'left' | 'right',
//         appendNode: ILayoutNode
//     ) => {
//         if (direction === 'left') {
//             // if (node.left !== null) throw new Error('왼쪽 이미 있당');

//             node.left = appendNode;
//         } else {
//             // if (node.right !== null) throw new Error('오른쪽 이미 있당');
//             node.right = appendNode;
//         }
//     };

//     const toggleOrentation = () => {
//         node.orientation =
//             node.orientation === 'horizontality'
//                 ? 'verticality'
//                 : 'horizontality';
//     };
//     const adjustRadio = (value: number) => {
//         let radioValue = value;
//         if (value <= 0.2) radioValue = 0.2;
//         if (value >= 0.8) radioValue = 0.8;
//         node.ratio = radioValue;
//     };

//     const getProperty = (key: keyof ISplitNode) => {
//         return node[key];
//     };

//     return {
//         node,
//         setChildren,
//         getProperty,
//         adjustRadio,
//         toggleOrentation,
//     };
// };

// const tree = (splitNode: ISplitNode, width: number, height: number) => {
//     const root = splitNode;
//     const rootSize = {
//         width,
//         height,
//     };

//     const getRoot = () => {
//         return root;
//     };

//     const getRootSize = () => {
//         return rootSize;
//     };

//     const resizeRootSize = (key: keyof typeof rootSize, value: number) => {
//         rootSize[key] = value;
//     };

//     return {
//         getRoot,
//         getRootSize,
//         resizeRootSize,
//     };
// };

// export { pannelNode, splitNode, tree };
// export type { ILayoutNode, IOrientaion, IPanelNode, ISplitNode };
