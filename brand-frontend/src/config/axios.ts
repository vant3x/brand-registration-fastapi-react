import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `${process.env.api_url}/api/v1/`,
    withCredentials: false
});

// Interceptor para añadir el token de acceso a las peticiones
axiosClient.interceptors.request.use(config => {
    // Este interceptor se deja vacío intencionadamente
    // porque el token se añade dinámicamente mediante la función authToken(token)
    // justo antes de cada llamada a la API. Esto nos da más control.
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor de respuesta para manejar la expiración del token
axiosClient.interceptors.response.use(
    response => response, // Si la respuesta es exitosa, la devolvemos tal cual
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no es un reintento
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marcamos la petición como reintento

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // Si no hay refresh token, redirigir al login o manejar el logout
                    // Aquí podrías llamar a una función de logout global
                    window.location.href = '/auth/login';
                    return Promise.reject(error);
                }

                // Pedimos un nuevo access token
                const response = await axiosClient.post('/auth/refresh', { refresh_token: refreshToken });
                const { access_token } = response.data;

                // Actualizamos el token en el localStorage o en el estado de la app
                // En nuestro caso, la función authToken lo actualiza en la instancia de axios
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

                // Actualizamos la cabecera de la petición original y la reintentamos
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return axiosClient(originalRequest);

            } catch (refreshError) {
                // Si el refresh token también falla, limpiamos todo y redirigimos al login
                console.error("Unable to refresh token, logging out.", refreshError);
                localStorage.removeItem('refreshToken');
                delete axiosClient.defaults.headers.common['Authorization'];
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
