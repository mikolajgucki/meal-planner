import axios from 'axios';

/** */
export default class Frontend {
    /** */
    static get(url) {
        const config = {
            headers: {
                'Accept': 'application/json'
            }
        };

        return new Promise((resolve,reject) => {
            axios.get(url,config)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}