const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const checkStatus = (response) => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response;
};

const getData = () =>
  fetch(`${BASE_URL}/data`)
    .then(checkStatus)
    .then((response) => response.json());

const sendData = (formData) =>
  fetch(`${BASE_URL}/`, {
    method: 'POST',
    body: formData,
  })
    .then(checkStatus)
    .then((response) => response.json());

export { getData, sendData };
