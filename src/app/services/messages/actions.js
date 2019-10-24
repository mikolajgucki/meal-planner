/** */
const types = {
    /** */
    ADD_MESSAGE: 'add_message',

    /** */
    REMOVE_MESSAGE: 'remove_message'
};

/** */
const actions = {
    types
};

/** */
actions.addMessage = function(id,text,messageType) {
    return { type: types.ADD_MESSAGE, id, text, messageType };
}

/** */
actions.removeMessage = function(id) {
    return { type: types.REMOVE_MESSAGE, id };
}

export default actions;