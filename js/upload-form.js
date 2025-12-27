import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';
import { initEffectsAndScale } from './effects-and-scale.js';
import { initUploadFormValidation } from './upload-form-validation.js';
import { isEscapeKey } from './util.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const formElement = document.querySelector('.img-upload__form');
const fileFieldElement = formElement.querySelector('.img-upload__input');
const overlayElement = formElement.querySelector('.img-upload__overlay');
const cancelButtonElement = formElement.querySelector('.img-upload__cancel');
const hashtagsFieldElement = formElement.querySelector('.text__hashtags');
const commentFieldElement = formElement.querySelector('.text__description');
const submitButtonElement = formElement.querySelector('.img-upload__submit');

const scaleSmallerButtonElement = formElement.querySelector('.scale__control--smaller');
const scaleBiggerButtonElement = formElement.querySelector('.scale__control--bigger');
const scaleValueInputElement = formElement.querySelector('.scale__control--value');

const previewImgElement = formElement.querySelector('.img-upload__preview img');
const effectsPreviewItemsElements = formElement.querySelectorAll('.effects__preview');

const effectsContainerElement = formElement.querySelector('.effects');
const effectLevelContainerElement = formElement.querySelector('.img-upload__effect-level');
const effectSliderElement = effectLevelContainerElement.querySelector('.effect-level__slider');
const effectLevelValueInputElement = effectLevelContainerElement.querySelector('.effect-level__value');

const bodyElement = document.body;

const editor = initEffectsAndScale({
  formElement,
  previewImgElement,
  scaleSmallerButtonElement,
  scaleBiggerButtonElement,
  scaleValueInputElement,
  effectsContainerElement,
  effectLevelContainerElement,
  effectSliderElement,
  effectLevelValueInputElement,
});

const pristine = initUploadFormValidation({
  formElement,
  hashtagsFieldElement,
  commentFieldElement,
});

let previewObjectUrl = null;
let onDocumentKeydown = null;

const isValidFileType = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((ext) => fileName.endsWith(ext));
};

const setPreviewImage = (file) => {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
  }

  previewObjectUrl = URL.createObjectURL(file);
  previewImgElement.src = previewObjectUrl;

  effectsPreviewItemsElements.forEach((itemElement) => {
    itemElement.style.backgroundImage = `url(${previewObjectUrl})`;
  });
};

const resetPreviewUrl = () => {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl);
    previewObjectUrl = null;
  }
};

const resetFormState = () => {
  formElement.reset();
  pristine.reset();
  editor.resetAll();
  editor.clearStyles();
  resetPreviewUrl();
};

const closeOverlay = ({ reset = false } = {}) => {
  overlayElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');

  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown);
    onDocumentKeydown = null;
  }

  if (reset) {
    resetFormState();
    fileFieldElement.value = '';
  }
};

const openOverlay = () => {
  overlayElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');

  onDocumentKeydown = (evt) => {
    if (!isEscapeKey(evt)) {
      return;
    }

    if (document.querySelector('.success') || document.querySelector('.error')) {
      return;
    }

    evt.preventDefault();
    closeOverlay({ reset: true });
  };

  document.addEventListener('keydown', onDocumentKeydown);
};

const onFileFieldChange = () => {
  const file = fileFieldElement.files && fileFieldElement.files[0];
  if (!file) {
    return;
  }

  if (!isValidFileType(file)) {
    fileFieldElement.value = '';
    return;
  }

  setPreviewImage(file);
  editor.resetAll();
  openOverlay();
};

const onCancelButtonClick = (evt) => {
  evt.preventDefault();
  closeOverlay({ reset: true });
};

const setSubmitBlocked = (isBlocked) => {
  submitButtonElement.disabled = isBlocked;
  submitButtonElement.textContent = isBlocked ? 'Отправляю...' : 'Опубликовать';
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  setSubmitBlocked(true);

  sendData(new FormData(formElement))
    .then(() => {
      closeOverlay({ reset: true });
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    })
    .finally(() => {
      setSubmitBlocked(false);
    });
};

fileFieldElement.addEventListener('change', onFileFieldChange);
cancelButtonElement.addEventListener('click', onCancelButtonClick);
formElement.addEventListener('submit', onFormSubmit);
