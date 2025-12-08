const bigPicture = document.querySelector('.big-picture');
const bigImageElement = bigPicture.querySelector('.big-picture__img img');
const likesElement = bigPicture.querySelector('.likes-count');
const commentsCounterElement = bigPicture.querySelector('.comments-count');
const commentsContainer = bigPicture.querySelector('.social__comments');
const descriptionElement = bigPicture.querySelector('.social__caption');
const counterBlock = bigPicture.querySelector('.social__comment-count');
const loaderBlock = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const body = document.body;

const createComment = (comment) => {
  const element = document.createElement('li');
  element.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const message = document.createElement('p');
  message.classList.add('social__text');
  message.textContent = comment.message;

  element.append(avatar, message);

  return element;
};

const renderComments = (comments) => {
  commentsContainer.innerHTML = '';

  comments.forEach((comment) => {
    const item = createComment(comment);
    commentsContainer.appendChild(item);
  });
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

const openBigPicture = (photo) => {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  bigImageElement.src = photo.url;
  bigImageElement.alt = photo.description;
  likesElement.textContent = photo.likes;
  commentsCounterElement.textContent = photo.comments.length;
  descriptionElement.textContent = photo.description;

  counterBlock.classList.add('hidden');
  loaderBlock.classList.add('hidden');

  renderComments(photo.comments);

  document.addEventListener('keydown', onDocumentKeydown);
};

closeButton.addEventListener('click', closeBigPicture);

export { openBigPicture };
