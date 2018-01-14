import { COMPOSE } from './constants/types';

export const getJingleIdsMock = () => [1, 2, 3, 4, 5, 6];

import img0 from './mockImages/render_0.png';
import img1 from './mockImages/render_1.png';
import img2 from './mockImages/render_2.png';
import img3 from './mockImages/render_3.png';
import img4 from './mockImages/render_4.png';
import img5 from './mockImages/render_5.png';
import img6 from './mockImages/render_6.png';
import img7 from './mockImages/render_7.png';
import img8 from './mockImages/render_8.png';
import img9 from './mockImages/render_9.png';
import img10 from './mockImages/render_10.png';
import img11 from './mockImages/render_11.png';
import img12 from './mockImages/render_12.png';
import img13 from './mockImages/render_13.png';
import img14 from './mockImages/render_14.png';

// Put some path resolver for audio source
export const getJingleFromJingleId = (jingleId) => {
  switch (jingleId) {
    case 1:
      return { id: jingleId, type: COMPOSE, name: 'Jingle', source: '../audio/s1.wav' };
    case 2:
      return { id: jingleId, type: COMPOSE, name: 'Some crazy', source: '../audio/s2.wav' };
    case 3:
      return { id: jingleId, type: COMPOSE, name: 'Yup', source: '../audio/s3.wav' };
    case 4:
      return { id: jingleId, type: COMPOSE, name: 'Give it a go', source: '../audio/s4.wav' };
    case 5:
      return { id: jingleId, type: COMPOSE, name: 'wup wup', source: '../audio/s5.wav' };
    case 6:
      return { id: jingleId, type: COMPOSE, name: 'Kek', source: '../audio/s6.wav' };
    default:
      return { id: 0, type: '', name: '', source: '' };
  }
};

export const getJingleSlots = () => [
  { accepts: [COMPOSE], lastDroppedItem: null },
  { accepts: [COMPOSE], lastDroppedItem: null },
  { accepts: [COMPOSE], lastDroppedItem: null },
  { accepts: [COMPOSE], lastDroppedItem: null },
  { accepts: [COMPOSE], lastDroppedItem: null },
];

export const getSongs = () => [
  { id: 0, author: 'Saban Saulic', name: 'OFFICIAL', imageSrc: img0 },
  { id: 1, author: 'Ceca', name: 'Beograd', imageSrc: img1 },
  { id: 2, author: 'Jaguar', name: 'BOG', imageSrc: img2 },
  { id: 3, author: 'Lil pump', name: 'Gucci Gang', imageSrc: img3 },
  { id: 4, author: 'Kendric Lamar', name: 'Humble', imageSrc: img4 },
  { id: 5, author: 'Zdravko Colic', name: 'Hotel', imageSrc: img5 },
  { id: 6, author: 'Red Hot Chilly Peppers', name: 'Californication', imageSrc: img6 },
  { id: 7, author: 'Vlado Georgiev', name: 'Hej ti', imageSrc: img7 },
  { id: 8, author: 'Aca Lukas', name: 'Licna karta', imageSrc: img8 },
  { id: 9, author: 'Halid Beslic', name: 'Miljacka', imageSrc: img9 },
  { id: 10, author: 'Drake', name: 'Started From The Bottom', imageSrc: img10 },
  { id: 11, author: 'Metallica', name: 'Enter Sandman', imageSrc: img11 },
  { id: 12, author: 'Gorillaz', name: 'Stylo', imageSrc: img12 },
  { id: 13, author: 'Deep Purple', name: 'Smoke on the watter', imageSrc: img13 },
  { id: 14, author: 'Djani', name: 'Sve mi tvoje nedostaje', imageSrc: img14 },
];
