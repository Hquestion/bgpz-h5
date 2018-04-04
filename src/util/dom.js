/**
 * 清空节点
 * @param node
 */
export function clearNode(node) {
    let childs = node.childNodes || [];
    childs.forEach(item => {
        node.removeChild(item);
    });
}
