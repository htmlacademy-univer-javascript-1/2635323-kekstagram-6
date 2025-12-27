const Scale = {
  MIN: 25,
  MAX: 100,
  STEP: 25,
  DEFAULT: 100,
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

const initEffectsAndScale = ({
  formElement,
  previewImgElement,
  scaleSmallerButtonElement,
  scaleBiggerButtonElement,
  scaleValueInputElement,
  effectsContainerElement,
  effectLevelContainerElement,
  effectSliderElement,
  effectLevelValueInputElement,
}) => {
  const getCurrentScale = () => parseInt(scaleValueInputElement.value, 10);

  const applyScale = (value) => {
    scaleValueInputElement.value = `${value}%`;
    previewImgElement.style.transform = `scale(${value / 100})`;
  };

  const onSmallerClick = () => {
    const newValue = Math.max(Scale.MIN, getCurrentScale() - Scale.STEP);
    applyScale(newValue);
  };

  const onBiggerClick = () => {
    const newValue = Math.min(Scale.MAX, getCurrentScale() + Scale.STEP);
    applyScale(newValue);
  };

  scaleSmallerButtonElement.addEventListener('click', onSmallerClick);
  scaleBiggerButtonElement.addEventListener('click', onBiggerClick);

  let currentEffect = EffectSettings.none;

  const hideSlider = () => effectLevelContainerElement.classList.add('hidden');
  const showSlider = () => effectLevelContainerElement.classList.remove('hidden');

  const applyEffectValue = (value) => {
    effectLevelValueInputElement.value = value;

    if (currentEffect === EffectSettings.none) {
      previewImgElement.style.filter = 'none';
      return;
    }

    previewImgElement.style.filter = currentEffect.getStyle(value);
  };

  noUiSlider.create(effectSliderElement, {
    range: {
      min: EffectSettings.chrome.min,
      max: EffectSettings.chrome.max,
    },
    start: EffectSettings.chrome.max,
    step: EffectSettings.chrome.step,
    connect: 'lower',
  });

  effectSliderElement.noUiSlider.on('update', (values) => {
    const value = Number(values[0]);
    applyEffectValue(value);
  });

  const setEffect = (effectName) => {
    currentEffect = EffectSettings[effectName];

    if (currentEffect === EffectSettings.none) {
      previewImgElement.style.filter = 'none';
      effectLevelValueInputElement.value = '';
      hideSlider();
      return;
    }

    showSlider();

    effectSliderElement.noUiSlider.updateOptions({
      range: {
        min: currentEffect.min,
        max: currentEffect.max,
      },
      start: currentEffect.max,
      step: currentEffect.step,
    });

    previewImgElement.style.filter = currentEffect.getStyle(currentEffect.max);
    effectLevelValueInputElement.value = currentEffect.max;
  };

  effectsContainerElement.addEventListener('change', (evt) => {
    if (!evt.target.classList.contains('effects__radio')) {
      return;
    }
    setEffect(evt.target.value);
  });

  const resetEffects = () => {
    const defaultEffectRadioElement = formElement.querySelector('#effect-none');
    if (defaultEffectRadioElement) {
      defaultEffectRadioElement.checked = true;
    }

    currentEffect = EffectSettings.none;
    previewImgElement.style.filter = 'none';
    effectLevelValueInputElement.value = '';
    hideSlider();
  };

  const resetScale = () => {
    applyScale(Scale.DEFAULT);
  };

  const resetAll = () => {
    resetScale();
    resetEffects();
  };

  resetAll();

  return {
    resetAll,
    resetScale,
    resetEffects,
    clearStyles: () => {
      previewImgElement.style.transform = '';
      previewImgElement.style.filter = '';
    },
  };
};

export { initEffectsAndScale };
