const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');

const commentsList = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');

const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const shownCountElement = bigPicture.querySelector('.social__comment-shown-count');
const totalCountElement = bigPicture.querySelector('.social__comment-total-count');

const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const body = document.body;

const COMMENTS_PER_PORTION = 5;

let currentComments = [];
let shownCommentsCount = 0;

const createCommentElement = (comment) => {
  const commentItem = document.createElement('li');
  commentItem.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentItem.append(avatar, text);
  return commentItem;
};

const renderComments = () => {
  commentsList.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const commentsToShow = currentComments.slice(0, shownCommentsCount);

  commentsToShow.forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });

  commentsList.appendChild(fragment);

  shownCountElement.textContent = String(shownCommentsCount);
  totalCountElement.textContent = String(currentComments.length);

  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  shownCommentsCount = Math.min(shownCommentsCount + COMMENTS_PER_PORTION, currentComments.length);
  renderComments();
};

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
}

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
}

function openBigPicture(photo) {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  bigPictureImg.src = photo.url;
  bigPictureImg.alt = photo.description;
  likesCount.textContent = String(photo.likes);
  socialCaption.textContent = photo.description;

  currentComments = photo.comments;
  shownCommentsCount = Math.min(COMMENTS_PER_PORTION, currentComments.length);

  socialCommentCount.classList.remove('hidden');

  renderComments();

  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
}

closeButton.addEventListener('click', closeBigPicture);

export { openBigPicture };
