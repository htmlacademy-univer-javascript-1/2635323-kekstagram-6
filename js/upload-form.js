import Pristine from './vendor/pristine/pristine.min.js';

const form = document.querySelector('.img-upload__form');
const fileField = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const hashtagsField = form.querySelector('.text__hashtags');
const commentField = form.querySelector('.text__description');
const body = document.body;

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeOverlay();
  }
};

const openOverlay = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
};

function closeOverlay() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  form.reset();
  fileField.value = '';
}

fileField.addEventListener('change', () => {
  if (fileField.files.length > 0) {
    openOverlay();
  }
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeOverlay();
});

const stopEscPropagation = (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
};

hashtagsField.addEventListener('keydown', stopEscPropagation);
commentField.addEventListener('keydown', stopEscPropagation);

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

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
  const hashtags = getHashtagsArray(value);
  return hashtags.every((tag) => HASHTAG_PATTERN.test(tag));
};

const checkHashtagCount = (value) => {
  const hashtags = getHashtagsArray(value);
  return hashtags.length <= MAX_HASHTAG_COUNT;
};

const checkHashtagUnique = (value) => {
  const hashtags = getHashtagsArray(value).map((t) => t.toLowerCase());
  const unique = new Set(hashtags);
  return unique.size === hashtags.length;
};

pristine.addValidator(
  hashtagsField,
  checkHashtagFormat,
  'Формат хэш-тега неверный: начинается с #, далее буквы/цифры, максимум 20 символов'
);

pristine.addValidator(
  hashtagsField,
  checkHashtagCount,
  'Нельзя указать больше пяти хэш-тегов'
);

pristine.addValidator(
  hashtagsField,
  checkHashtagUnique,
  'Хэш-теги не должны повторяться'
);

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(
  commentField,
  validateComment,
  'Комментарий не может быть длиннее 140 символов'
);

form.addEventListener('submit', (evt) => {
  const isValid = pristine.validate();

  if (!isValid) {
    evt.preventDefault();
  }
});
