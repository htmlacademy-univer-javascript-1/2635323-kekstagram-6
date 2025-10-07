const PHOTO_COUNT = 25;
const MAX_COMMENT = 30;

const DESCRIPTIONS = [
  'Закат над бескрайним океаном',
  'Городские огни в ночной дымке',
  'Осенний лес в золотом убранстве',
  'Архитектурный шедевр эпохи возрождения',
  'Уличный музыкант дарит эмоции прохожим',
  'Кофе утром - ритуал пробуждения',
  'Горная вершина, касающаяся облаков',
  'Старый мост через бурную реку',
  'Дождь на оконном стекле'
];

const NAMES = [
  'Александр', 'Виктория', 'Максим', 'София', 'Кирилл', 'Алиса', 'Даниил', 'Полина'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const Likes = {
  MIN:15,
  MAX:200
};

const AvatarNumber = {
  MIN: 1,
  MAX: 6
};

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => ++lastGeneratedId;

};

const generateCommentId = createIdGenerator();

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const addComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(AvatarNumber.MIN, AvatarNumber.MAX)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const addComments = () => Array.from({ length: getRandomInteger(0, MAX_COMMENT) }, addComment);


const addPhoto = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(Likes.MIN, Likes.MAX),
  comments: addComments()
});

const photos = () => Array.from({ length: PHOTO_COUNT }, (_, index) => addPhoto(index + 1));

export { photos };
