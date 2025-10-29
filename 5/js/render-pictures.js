const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const fragment = document.createDocumentFragment();

const createThumbnail = (picture) => {
  const { url, description, likes, comments } = picture;
  const pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__img').alt = description;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  return pictureElement;
};

const renderPhotos = (photoList) => {
  photoList.forEach((item) => {
    fragment.appendChild(createThumbnail(item));
  });
  picturesContainer.appendChild(fragment);
};

export { renderPhotos };
