import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';
import { initEffectsAndScale } from './effects-and-scale.js';

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const form = document.querySelector('.img-upload__form');
const fileField = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const hashtagsField = form.querySelector('.text__hashtags');
const commentField = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const scaleSmallerButton = form.querySelector('.scale__control--smaller');
const scaleBiggerButton = form.querySelector('.scale__control--bigger');
const scaleValueInput = form.querySelector('.scale__control--value');

const previewImg = form.querySelector('.img-upload__preview img');

const effectsContainer = form.querySelector('.effects');
const effectLevelContainer = form.querySelector('.img-upload__effect-level');
const effectSliderElement = effectLevelContainer.querySelector('.effect-level__slider');
const effectLevelValueInput = effectLevelContainer.querySelector('.effect-level__value');

const body = document.body;

const editor = initEffectsAndScale({
  form,
  previewImg,
  scaleSmallerButton,
  scaleBiggerButton,
  scaleValueInput,
  effectsContainer,
  effectLevelContainer,
  effectSliderElement,
  effectLevelValueInput,
});

const pristine = new Pristine(form, {
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

pristine.addValidator(hashtagsField, checkHashtagFormat, 'Неверный хэш-тег');
pristine.addValidator(hashtagsField, checkHashtagCount, 'Нельзя больше 5 хэш-тегов');
pristine.addValidator(hashtagsField, checkHashtagUnique, 'Хэш-теги не должны повторяться');

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;
pristine.addValidator(commentField, validateComment, 'Комментарий максимум 140 символов');

const stopEscPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};
hashtagsField.addEventListener('keydown', stopEscPropagation);
commentField.addEventListener('keydown', stopEscPropagation);

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeOverlay(true);
  }
};

const openOverlay = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  editor.resetAll();
};

const resetFormFull = () => {
  form.reset();
  pristine.reset();
  fileField.value = '';
  editor.resetAll();
};

function closeOverlay(doReset) {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  if (doReset) {
    resetFormFull();
  }
}

fileField.addEventListener('change', () => {
  if (fileField.files.length > 0) {
    openOverlay();
  }
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeOverlay(true);
});

const blockSubmit = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Отправляю...';
};

const unblockSubmit = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  blockSubmit();

  sendData(new FormData(form))
    .then(() => {
      closeOverlay(true);
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    })
    .finally(() => {
      unblockSubmit();
    });
});
