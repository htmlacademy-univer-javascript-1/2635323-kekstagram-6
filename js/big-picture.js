import { isEscapeKey } from './util.js';

const COMMENTS_PER_PORTION = 5;
const AVATAR_SIZE = 35;

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImgElement = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');

const commentsListElement = bigPictureElement.querySelector('.social__comments');
const socialCaptionElement = bigPictureElement.querySelector('.social__caption');

const shownCountElement = bigPictureElement.querySelector('.social__comment-shown-count');
const totalCountElement = bigPictureElement.querySelector('.social__comment-total-count');

const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const closeButtonElement = bigPictureElement.querySelector('.big-picture__cancel');
const bodyElement = document.body;

let currentComments = [];
let shownCommentsCount = 0;

let onDocumentKeydown = null;

const createCommentElement = (comment) => {
  const commentItemElement = document.createElement('li');
  commentItemElement.classList.add('social__comment');

  const avatarElement = document.createElement('img');
  avatarElement.classList.add('social__picture');
  avatarElement.src = comment.avatar;
  avatarElement.alt = comment.name;
  avatarElement.width = AVATAR_SIZE;
  avatarElement.height = AVATAR_SIZE;

  const textElement = document.createElement('p');
  textElement.classList.add('social__text');
  textElement.textContent = comment.message;

  commentItemElement.append(avatarElement, textElement);
  return commentItemElement;
};

const renderComments = () => {
  commentsListElement.innerHTML = '';

  const fragment = document.createDocumentFragment();
  currentComments.slice(0, shownCommentsCount).forEach((comment) => {
    fragment.appendChild(createCommentElement(comment));
  });

  commentsListElement.appendChild(fragment);

  shownCountElement.textContent = String(shownCommentsCount);
  totalCountElement.textContent = String(currentComments.length);

  commentsLoaderElement.classList.toggle('hidden', shownCommentsCount >= currentComments.length);
};

const onCommentsLoaderClick = () => {
  shownCommentsCount = Math.min(shownCommentsCount + COMMENTS_PER_PORTION, currentComments.length);
  renderComments();
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }

  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
};

const openBigPicture = (photo) => {
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  bigPictureImgElement.src = photo.url;
  bigPictureImgElement.alt = photo.description;
  likesCountElement.textContent = String(photo.likes);

  socialCaptionElement.textContent = photo.description;

  currentComments = photo.comments;
  shownCommentsCount = Math.min(COMMENTS_PER_PORTION, currentComments.length);

  renderComments();

  onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeBigPicture();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
};

const onCloseButtonClick = (evt) => {
  evt.preventDefault();
  closeBigPicture();
};

closeButtonElement.addEventListener('click', onCloseButtonClick);

export { openBigPicture };
