import { isEscapeKey } from './util.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const createPristine = (formElement) =>
  new Pristine(formElement, {
    classTo: 'img-upload__field-wrapper',
    errorClass: 'img-upload__field-wrapper--invalid',
    successClass: 'img-upload__field-wrapper--valid',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__error',
  });

const getHashtagsArray = (value) =>
  value
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

const checkHashtagFormat = (value) => {
  if (!value.trim()) {
    return true;
  }
  const hashtags = getHashtagsArray(value);
  return hashtags.every((tag) => HASHTAG_PATTERN.test(tag));
};

const checkHashtagCount = (value) => {
  if (!value.trim()) {
    return true;
  }
  return getHashtagsArray(value).length <= MAX_HASHTAG_COUNT;
};

const checkHashtagUnique = (value) => {
  if (!value.trim()) {
    return true;
  }
  const hashtags = getHashtagsArray(value).map((t) => t.toLowerCase());
  return new Set(hashtags).size === hashtags.length;
};

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const stopEscPropagation = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const initUploadFormValidation = ({ formElement, hashtagsFieldElement, commentFieldElement }) => {
  const pristine = createPristine(formElement);

  pristine.addValidator(hashtagsFieldElement, checkHashtagFormat, 'Неверный хэш-тег');
  pristine.addValidator(hashtagsFieldElement, checkHashtagCount, 'Нельзя больше 5 хэш-тегов');
  pristine.addValidator(hashtagsFieldElement, checkHashtagUnique, 'Хэш-теги не должны повторяться');

  pristine.addValidator(commentFieldElement, validateComment, 'Комментарий максимум 140 символов');

  hashtagsFieldElement.addEventListener('keydown', stopEscPropagation);
  commentFieldElement.addEventListener('keydown', stopEscPropagation);

  return pristine;
};

export { initUploadFormValidation };
