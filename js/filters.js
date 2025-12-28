import { debounce, getRandomInteger } from './util.js';
import { renderPhotos } from './render-pictures.js';

const FILTER_RANDOM_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const imgFilters = document.querySelector('.img-filters');
const form = imgFilters.querySelector('.img-filters__form');

const showFilters = () => {
  imgFilters.classList.remove('img-filters--inactive');
};

const setActiveButton = (button) => {
  form.querySelectorAll('.img-filters__button').forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });
  button.classList.add('img-filters__button--active');
};

const getRandomUnique = (photos, count) => {
  const result = [];
  const usedIds = new Set();

  while (result.length < Math.min(count, photos.length)) {
    const index = getRandomInteger(0, photos.length - 1);
    const photo = photos[index];

    if (!usedIds.has(photo.id)) {
      usedIds.add(photo.id);
      result.push(photo);
    }
  }
  return result;
};

const initFilters = (photosFromServer) => {
  const photosDefault = photosFromServer.slice();

  const rerender = debounce((list) => renderPhotos(list), DEBOUNCE_DELAY);

  form.addEventListener('click', (evt) => {
    const button = evt.target.closest('.img-filters__button');
    if (!button) {
      return;
    }

    setActiveButton(button);

    if (button.id === 'filter-default') {
      rerender(photosDefault);
      return;
    }

    if (button.id === 'filter-random') {
      rerender(getRandomUnique(photosDefault, FILTER_RANDOM_COUNT));
      return;
    }

    if (button.id === 'filter-discussed') {
      const sorted = photosDefault
        .slice()
        .sort((a, b) => b.comments.length - a.comments.length);

      rerender(sorted);
    }
  });
};

export { showFilters, initFilters };
