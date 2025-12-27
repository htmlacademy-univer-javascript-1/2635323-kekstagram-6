const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const load = (url, options = {}) =>
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    });

const getData = () => load(`${BASE_URL}/data`);

const sendData = (formData) =>
  fetch(BASE_URL, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  });

export { getData, sendData };
