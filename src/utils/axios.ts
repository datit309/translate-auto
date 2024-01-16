import axios from 'axios';
// import Cookies from 'js-cookie'

const instance = axios.create({
  baseURL: process.env.API_CRM,
  headers: {
    // Authorization: `Bearer ${Cookies.get('token')}`,
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});
export default (method: string, path: string, body: {}, headers: {}) => {
  return new Promise((resolve, reject) => {
    switch (method.toUpperCase()) {
      case 'GET': {
        return instance
          .get(path, {
            params: body,
            headers,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((e) => reject(e.message));
      }
      case 'POST': {
        return instance
          .post(path, body, { headers })
          .then((response) => {
            resolve(response.data);
          })
          .catch((e) => reject(e.message));
      }
      case 'PUT': {
        return instance
          .put(path, body, {
            params: body,
            headers,
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((e) => reject(e.message));
      }
      case 'DELETE': {
        return instance
          .delete(path, { headers })
          .then((response) => {
            resolve(response.data);
          })
          .catch((e) => reject(e.message));
      }
      default: {
      }
    }
  });
};
