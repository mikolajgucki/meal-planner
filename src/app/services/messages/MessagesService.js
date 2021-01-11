import StateService from '../state/StateService';
import MessageTypes from './MessageTypes';
import actions from './actions';

/** */
let idSeq = 0;

/** */
function nextId() {
    return idSeq++;
}

/** */
export default class MessagesService {
    /** */
    static addMessage(text,messageType = MessageTypes.INFO) {
        StateService.dispatch(actions.addMessage(nextId(),text,messageType));
    }

    /** */
    static removeMessage(id) {
        StateService.dispatch(actions.removeMessage(id));
    }
}
