const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const isEscapeKey = (evt) => evt.key === 'Escape';

let currentMessage = null;

const removeMessage = (messageElement) => {
  messageElement.remove();
  document.removeEventListener('keydown', onDocumentKeydown, true);
  document.removeEventListener('click', onDocumentClick, true);
};

function onDocumentKeydown(evt) {
  if (!currentMessage) {
    return;
  }

  if (isEscapeKey(evt)) {
    evt.preventDefault();
    evt.stopPropagation();

    removeMessage(currentMessage);
    currentMessage = null;
  }
}

function onDocumentClick(evt) {
  if (!currentMessage) {
    return;
  }

  const inner = currentMessage.querySelector('.success__inner, .error__inner');
  const button = currentMessage.querySelector('button');

  if (evt.target === button || (inner && !inner.contains(evt.target))) {
    evt.preventDefault();
    evt.stopPropagation();

    removeMessage(currentMessage);
    currentMessage = null;
  }
}

const showMessage = (template) => {
  if (currentMessage) {
    removeMessage(currentMessage);
    currentMessage = null;
  }

  const messageElement = template.cloneNode(true);
  messageElement.style.zIndex = '10000';

  document.body.append(messageElement);
  currentMessage = messageElement;

  document.addEventListener('keydown', onDocumentKeydown, true);
  document.addEventListener('click', onDocumentClick, true);
};

const showSuccessMessage = () => showMessage(successTemplate);
const showErrorMessage = () => showMessage(errorTemplate);

export { showSuccessMessage, showErrorMessage };
