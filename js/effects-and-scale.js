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
  form,
  previewImg,
  scaleSmallerButton,
  scaleBiggerButton,
  scaleValueInput,
  effectsContainer,
  effectLevelContainer,
  effectSliderElement,
  effectLevelValueInput,
}) => {
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

  scaleSmallerButton.addEventListener('click', onSmallerClick);
  scaleBiggerButton.addEventListener('click', onBiggerClick);

  let currentEffect = EffectSettings.none;

  const hideSlider = () => effectLevelContainer.classList.add('hidden');
  const showSlider = () => effectLevelContainer.classList.remove('hidden');

  const applyEffectValue = (value) => {
    effectLevelValueInput.value = value;

    if (currentEffect === EffectSettings.none) {
      previewImg.style.filter = 'none';
      return;
    }

    previewImg.style.filter = currentEffect.getStyle(value);
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
      previewImg.style.filter = 'none';
      effectLevelValueInput.value = '';
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

    previewImg.style.filter = currentEffect.getStyle(currentEffect.max);
    effectLevelValueInput.value = currentEffect.max;
  };

  effectsContainer.addEventListener('change', (evt) => {
    if (!evt.target.classList.contains('effects__radio')) {
      return;
    }
    setEffect(evt.target.value);
  });

  const resetEffects = () => {
    const defaultEffectRadio = form.querySelector('#effect-none');
    if (defaultEffectRadio) {
      defaultEffectRadio.checked = true;
    }

    currentEffect = EffectSettings.none;
    previewImg.style.filter = 'none';
    effectLevelValueInput.value = '';
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
      previewImg.style.transform = '';
      previewImg.style.filter = '';
    },
  };
};

export { initEffectsAndScale };
