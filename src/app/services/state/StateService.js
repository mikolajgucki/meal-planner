/** */
export default class StateService {
    /** */
    static init(store) {
        StateService.store = store;
    }

    /** */
    static dispatch(action) {
        StateService.store.dispatch(action);
    }
}