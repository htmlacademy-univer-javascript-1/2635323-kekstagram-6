const body = document.body;

const isEscapeKey = (evt) => evt.key === 'Escape';

const showMessage = (templateId, closeButtonClass) => {
  const template = document.querySelector(templateId).content.querySelector('section');
  const message = template.cloneNode(true);
  body.append(message);

  const closeButton = message.querySelector(closeButtonClass);

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closeMessage();
    }
  };

  const onOutsideClick = (evt) => {
    if (evt.target === message) {
      closeMessage();
    }
  };

  function closeMessage() {
    message.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    message.removeEventListener('click', onOutsideClick);
    closeButton.removeEventListener('click', closeMessage);
  }

  document.addEventListener('keydown', onDocumentKeydown);
  message.addEventListener('click', onOutsideClick);
  closeButton.addEventListener('click', closeMessage);
};

const showSuccessMessage = () => showMessage('#success', '.success__button');
const showErrorMessage = () => showMessage('#error', '.error__button');

export { showSuccessMessage, showErrorMessage };
