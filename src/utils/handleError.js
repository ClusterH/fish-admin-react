
const handleError = (err, history) => {
    if (err.response?.status === 401) {
        localStorage.removeItem('jwtToken');
        history.push('/auth/login');
    } else if (err.response?.status === 500) {
        alert(`Server Error: ${err.response?.data?.msg}`);
    }
};

export default handleError;
