import actions from './actions';

/** */
function messages(state = [],action) {
    if (action.type === actions.types.ADD_MESSAGE) {
        return [ ...state, {
            id: action.id,
            text: action.text,
            type: action.messageType
        } ];
    }
    if (action.type === actions.types.REMOVE_MESSAGE) {
        return state.filter(message => message.id !== action.id);
    }
    return state;
}

export default messages;
