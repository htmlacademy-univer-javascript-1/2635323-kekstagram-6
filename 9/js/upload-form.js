const form = document.querySelector('.img-upload__form');
const fileField = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const hashtagsField = form.querySelector('.text__hashtags');
const commentField = form.querySelector('.text__description');

const scaleSmallerButton = form.querySelector('.scale__control--smaller');
const scaleBiggerButton = form.querySelector('.scale__control--bigger');
const scaleValueInput = form.querySelector('.scale__control--value');

const previewImg = form.querySelector('.img-upload__preview img');

const effectsList = form.querySelector('.effects');
const effectLevel = form.querySelector('.img-upload__effect-level');
const effectSlider = effectLevel.querySelector('.effect-level__slider');
const effectLevelValue = effectLevel.querySelector('.effect-level__value');

const body = document.body;

const Scale = {
  MIN: 25,
  MAX: 100,
  STEP: 25,
  DEFAULT: 100,
};

const getCurrentScale = () => parseInt(scaleValueInput.value, 10);

const applyScale = (value) => {
  scaleValueInput.value = `${value}%`;
  previewImg.style.transform = `scale(${value / 100})`;
};

const onSmallerClick = () => {
  const newValue = Math.max(Scale.MIN, getCurrentScale() - Scale.STEP);
  applyScale(newValue);
};

const onBiggerClick = () => {
  const newValue = Math.min(Scale.MAX, getCurrentScale() + Scale.STEP);
  applyScale(newValue);
};

const EffectSettings = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    getStyle: () => 'none',
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    getStyle: (value) => `grayscale(${value})`,
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    getStyle: (value) => `sepia(${value})`,
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    getStyle: (value) => `invert(${value}%)`,
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    getStyle: (value) => `blur(${value}px)`,
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    getStyle: (value) => `brightness(${value})`,
  },
};

let currentEffect = EffectSettings.none;

noUiSlider.create(effectSlider, {
  range: {
    min: EffectSettings.chrome.min,
    max: EffectSettings.chrome.max,
  },
  start: EffectSettings.chrome.max,
  step: EffectSettings.chrome.step,
  connect: 'lower',
});

effectSlider.noUiSlider.on('update', (values) => {
  const value = values[0];

  effectLevelValue.value = value;

  if (currentEffect === EffectSettings.none) {
    previewImg.style.filter = 'none';
    return;
  }

  previewImg.style.filter = currentEffect.getStyle(value);
});

const setEffect = (effectName) => {
  currentEffect = EffectSettings[effectName];

  if (currentEffect === EffectSettings.none) {
    previewImg.style.filter = 'none';
    effectLevelValue.value = '';
    effectLevel.classList.add('hidden');
    return;
  }

  effectLevel.classList.remove('hidden');

  effectSlider.noUiSlider.updateOptions({
    range: {
      min: currentEffect.min,
      max: currentEffect.max,
    },
    start: currentEffect.max,
    step: currentEffect.step,
  });
};

effectsList.addEventListener('change', (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }
  setEffect(evt.target.value);
});

const resetEditor = () => {
  applyScale(Scale.DEFAULT);

  const defaultEffectRadio = form.querySelector('#effect-none');
  if (defaultEffectRadio) {
    defaultEffectRadio.checked = true;
  }
  setEffect('none');
};

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

  resetEditor();
};

function closeOverlay() {
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  form.reset();
  fileField.value = '';
  resetEditor();
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

scaleSmallerButton.addEventListener('click', onSmallerClick);
scaleBiggerButton.addEventListener('click', onBiggerClick);

resetEditor();

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
  const hashtags = getHashtagsArray(value);
  return hashtags.length <= MAX_HASHTAG_COUNT;
};

const checkHashtagUnique = (value) => {
  if (!value.trim()) {
    return true;
  }
  const hashtags = getHashtagsArray(value).map((t) => t.toLowerCase());
  const unique = new Set(hashtags);
  return unique.size === hashtags.length;
};

pristine.addValidator(
  hashtagsField,
  checkHashtagFormat,
  'Неверный формат хэш-тега: начинается с #, далее буквы/цифры, максимум 20 символов'
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
