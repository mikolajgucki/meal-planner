import browser from 'browser-detect';
import Log from '../../log/Log';

/** */
export default class BrowserService {
    /** */
    static init() {
        BrowserService.mobile = browser().mobile;
        if (BrowserService.mobile) {
            Log.info('Browser is mobile');
        }
        else {
            Log.info('Browser is not mobile');
        }
    }

    /** */
    static isMobile() {
        return BrowserService.mobile;
    }
}