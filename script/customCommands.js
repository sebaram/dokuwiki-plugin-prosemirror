/**
 * Returns a command that tries to set the selected textblocks to the given node type with the given attributes.
 *
 * Copied and adjusted from prosemirror-commands::setBlockType to not check for the node attributes
 */
export function setBlockTypeNoAttrCheck(nodeType, attrs) { // eslint-disable-line import/prefer-default-export
    return function setBlockTypeNoAttrCheckDispatch(state, dispatch) {
        const { from, to } = state.selection;
        let applicable = false;
        state.doc.nodesBetween(from, to, (node, pos) => {
            if (applicable) return false;
            if (!node.isTextblock || node.type === nodeType) return true;
            const $pos = state.doc.resolve(pos);
            const index = $pos.index();
            applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
            return true;
        });
        if (!applicable) return false;
        if (dispatch) dispatch(state.tr.setBlockType(from, to, nodeType, attrs).scrollIntoView());
        return true;
    };
}
