import { renderPhotos } from './render-pictures.js';
import { debounce } from './util.js';

const FILTER_RANDOM_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const filtersSection = document.querySelector('.img-filters');
const filtersForm = document.querySelector('.img-filters__form');

const setActiveButton = (button) => {
  filtersForm.querySelectorAll('.img-filters__button').forEach((btn) => {
    btn.classList.remove('img-filters__button--active');
  });
  button.classList.add('img-filters__button--active');
};

const getRandomPhotos = (photos) => {
  const copy = photos.slice();
  copy.sort(() => Math.random() - 0.5);
  return copy.slice(0, FILTER_RANDOM_COUNT);
};

const getDiscussedPhotos = (photos) =>
  photos.slice().sort((a, b) => b.comments.length - a.comments.length);

const initFilters = (photosFromServer) => {
  filtersSection.classList.remove('img-filters--inactive');

  const applyFilterDebounced = debounce((filterId) => {
    if (filterId === 'filter-default') {
      renderPhotos(photosFromServer);
      return;
    }

    if (filterId === 'filter-random') {
      renderPhotos(getRandomPhotos(photosFromServer));
      return;
    }

    if (filterId === 'filter-discussed') {
      renderPhotos(getDiscussedPhotos(photosFromServer));
    }
  }, DEBOUNCE_DELAY);

  filtersForm.addEventListener('click', (evt) => {
    const button = evt.target.closest('.img-filters__button');
    if (!button) {
      return;
    }

    setActiveButton(button);
    applyFilterDebounced(button.id);
  });
};

export { initFilters };
