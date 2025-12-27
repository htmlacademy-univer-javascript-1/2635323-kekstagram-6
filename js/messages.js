import { isEscapeKey } from './util.js';

const successTemplateElement = document
  .querySelector('#success')
  .content
  .querySelector('.success');

const errorTemplateElement = document
  .querySelector('#error')
  .content
  .querySelector('.error');

let currentMessageElement = null;
let onDocumentKeydown = null;
let onDocumentClick = null;

const hideMessage = () => {
  if (!currentMessageElement) {
    return;
  }

  currentMessageElement.remove();

  if (onDocumentKeydown) {
    document.removeEventListener('keydown', onDocumentKeydown, true);
  }
  if (onDocumentClick) {
    document.removeEventListener('click', onDocumentClick, true);
  }

  currentMessageElement = null;
  onDocumentKeydown = null;
  onDocumentClick = null;
};

const showMessage = (templateElement) => {
  hideMessage();

  const messageElement = templateElement.cloneNode(true);
  messageElement.style.zIndex = '10000';
  document.body.append(messageElement);
  currentMessageElement = messageElement;

  onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopPropagation();
      hideMessage();
    }
  };

  onDocumentClick = (evt) => {
    const innerElement = currentMessageElement
      ? currentMessageElement.querySelector('.success__inner, .error__inner')
      : null;

    const buttonElement = currentMessageElement
      ? currentMessageElement.querySelector('button')
      : null;

    const isCloseButton = evt.target === buttonElement;
    const isOutsideInner = innerElement ? !innerElement.contains(evt.target) : true;

    if (isCloseButton || isOutsideInner) {
      evt.preventDefault();
      evt.stopPropagation();
      hideMessage();
    }
  };

  document.addEventListener('keydown', onDocumentKeydown, true);
  document.addEventListener('click', onDocumentClick, true);
};

const showSuccessMessage = () => showMessage(successTemplateElement);
const showErrorMessage = () => showMessage(errorTemplateElement);

export { showSuccessMessage, showErrorMessage };
