import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081',
    validateStatus: (status) => {
        // Aceita status 204 e 200 como válidos
        return status >= 200 && status < 300;
      },
});

export { api }