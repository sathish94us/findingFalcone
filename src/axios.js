import axios from 'axios';

axios.defaults.baseURL = "https://findfalcone.herokuapp.com";
const instance = axios.create();

instance.interceptors.request.use(request => {
    var url = request.url;
    if(url === "/token" || url === "/find") {
        request.headers.post['Accept'] = 'application/json';
    }
    return request;
}, error => {
    return Promise.reject(error);
});

export default instance;