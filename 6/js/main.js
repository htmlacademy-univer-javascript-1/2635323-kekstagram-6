import './util.js';
import { photos } from './data.js';
import { renderPhotos } from './render-pictures.js';

const generatedPhotos = photos();

renderPhotos(generatedPhotos);
