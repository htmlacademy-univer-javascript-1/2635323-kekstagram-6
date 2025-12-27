import { renderPhotos } from './render-pictures.js';
import { getData } from './api.js';
import './upload-form.js';
import { showFilters, initFilters } from './filters.js';

const showLoadError = () => {
  const errorBlock = document.createElement('div');
  errorBlock.style.padding = '10px';
  errorBlock.style.margin = '10px auto';
  errorBlock.style.maxWidth = '600px';
  errorBlock.style.background = '#ffdddd';
  errorBlock.style.border = '1px solid #ff8888';
  errorBlock.style.textAlign = 'center';
  errorBlock.textContent = 'Не удалось загрузить фотографии. Попробуйте обновить страницу.';
  document.body.insertAdjacentElement('afterbegin', errorBlock);
};

getData()
  .then((photos) => {
    renderPhotos(photos);
    showFilters();
    initFilters(photos);
  })
  .catch(() => {
    showLoadError();
  });
