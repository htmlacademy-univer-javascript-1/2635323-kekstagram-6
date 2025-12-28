import { debounce, getRandomInteger } from './util.js';
import { renderPhotos } from './render-pictures.js';

const FILTER_RANDOM_COUNT = 10;
const RERENDER_DELAY = 500;

const imgFiltersElement = document.querySelector('.img-filters');
const filtersFormElement = imgFiltersElement.querySelector('.img-filters__form');

const showFilters = () => {
  imgFiltersElement.classList.remove('img-filters--inactive');
};

const setActiveButton = (activeButtonElement) => {
  filtersFormElement.querySelectorAll('.img-filters__button').forEach((buttonElement) => {
    buttonElement.classList.remove('img-filters__button--active');
  });

  activeButtonElement.classList.add('img-filters__button--active');
};

const getRandomUniquePhotos = (photos, count) => {
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

const sortByCommentsDesc = (photos) =>
  photos.slice().sort((a, b) => b.comments.length - a.comments.length);

const initFilters = (photosFromServer) => {
  const photosDefault = photosFromServer.slice();

  const rerender = debounce((photos) => {
    renderPhotos(photos);
  }, RERENDER_DELAY);

  const onFiltersFormClick = (evt) => {
    const buttonElement = evt.target.closest('.img-filters__button');
    if (!buttonElement) {
      return;
    }

    evt.preventDefault();

    setActiveButton(buttonElement);

    switch (buttonElement.id) {
      case 'filter-default':
        rerender(photosDefault);
        break;
      case 'filter-random':
        rerender(getRandomUniquePhotos(photosDefault, FILTER_RANDOM_COUNT));
        break;
      case 'filter-discussed':
        rerender(sortByCommentsDesc(photosDefault));
        break;
      default:
        rerender(photosDefault);
    }
  };

  filtersFormElement.addEventListener('click', onFiltersFormClick);
};

export { showFilters, initFilters };
