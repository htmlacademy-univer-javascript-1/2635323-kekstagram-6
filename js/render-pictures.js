import { openBigPicture } from './big-picture.js';

const picturesContainerElement = document.querySelector('.pictures');
const pictureTemplateElement = document.querySelector('#picture').content.querySelector('.picture');

const clearPhotos = () => {
  const picturesElements = picturesContainerElement.querySelectorAll('.picture');
  picturesElements.forEach((pictureElement) => pictureElement.remove());
};

const createThumbnail = (picture) => {
  const { url, description, likes, comments } = picture;
  const pictureElement = pictureTemplateElement.cloneNode(true);

  const imgElement = pictureElement.querySelector('.picture__img');
  imgElement.src = url;
  imgElement.alt = description;

  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  const onThumbnailClick = (evt) => {
    evt.preventDefault();
    openBigPicture(picture);
  };

  pictureElement.addEventListener('click', onThumbnailClick);

  return pictureElement;
};

const renderPhotos = (photoList) => {
  clearPhotos();

  const fragment = document.createDocumentFragment();
  photoList.forEach((item) => {
    fragment.appendChild(createThumbnail(item));
  });

  picturesContainerElement.appendChild(fragment);
};

export { renderPhotos };
