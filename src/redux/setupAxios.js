export default function setupAxios(axios, store) {
    axios.interceptors.request.use(
        config => {
            // const {
            //   auth: { authToken }
            // } = store.getState();

            const authToken = localStorage.getItem('jwtToken');

            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }

            return config;
        },
        err => Promise.reject(err)
    );
}
