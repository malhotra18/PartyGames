export type ImageRound = {
  kind: 'image';
  questionImage: string;
  answerImage: string;
};

export type ChoiceRound = {
  kind: 'choice';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  image: string;
};

export type PriceRound = {
  kind: 'price';
  question: string;
  price: number;
  image: string;
};

export type GameRound = ImageRound | ChoiceRound | PriceRound;
export type GameId = 'game-1' | 'game-2' | 'game-3';

export type GameDefinition = {
  id: GameId;
  title: string;
  shortTitle: string;
  rounds: GameRound[];
};

const movieRounds: ImageRound[] = Array.from({ length: 15 }, (_, index) => {
  const questionPage = 3 + index * 2;
  return {
    kind: 'image',
    questionImage:
      questionPage === 13
        ? '/game1/page-13-dangal-v2.jpg'
        : `/game1/page-${String(questionPage).padStart(2, '0')}.jpg`,
    answerImage: `/game1/page-${String(questionPage + 1).padStart(2, '0')}.jpg`,
  };
});

const foodRounds: ChoiceRound[] = [
  {
    kind: 'choice',
    question: 'Masala dosa is most strongly associated with which Indian state?',
    options: ['Kerala', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu'],
    correctIndex: 1,
    image: '/game2/01.jpg',
  },
  {
    kind: 'choice',
    question: 'Vada pav is a signature street food of which state?',
    options: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'],
    correctIndex: 0,
    image: '/game2/03.jpg',
  },
  {
    kind: 'choice',
    question: 'Mysore Pak is a celebrated sweet from which state?',
    options: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Telangana'],
    correctIndex: 1,
    image: '/game2/04.jpg',
  },
  {
    kind: 'choice',
    question: 'This quiz connects tangy pani puri (golgappa) with which state?',
    options: ['Maharashtra', 'Uttar Pradesh', 'Gujarat', 'Punjab'],
    correctIndex: 2,
    image: '/game2/05.jpg',
  },
  {
    kind: 'choice',
    question: 'Malai kofta is associated here with which state?',
    options: ['Uttar Pradesh', 'Rajasthan', 'Punjab', 'Madhya Pradesh'],
    correctIndex: 0,
    image: '/game2/06.jpg',
  },
  {
    kind: 'choice',
    question: 'Biryani is associated with which state?',
    options: ['Punjab', 'Uttar Pradesh', 'Telangana', 'Tamil Nadu'],
    correctIndex: 2,
    image: '/game2/07.jpg',
  },
  {
    kind: 'choice',
    question: 'Creamy Shahi Paneer is linked with which state in this quiz?',
    options: ['Punjab', 'Uttar Pradesh', 'Haryana', 'Rajasthan'],
    correctIndex: 1,
    image: '/game2/08.jpg',
  },
  {
    kind: 'choice',
    question: 'Spicy and tangy aloo chaat is especially associated with which region?',
    options: ['West Bengal', 'Bihar', 'Uttar Pradesh', 'Delhi'],
    correctIndex: 3,
    image: '/game2/09.jpg',
  },
  {
    kind: 'choice',
    question: 'Bisi Bele Bath is a classic dish from which state?',
    options: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'],
    correctIndex: 0,
    image: '/game2/10.jpg',
  },
  {
    kind: 'choice',
    question: 'Sweet, creamy rabri is linked here with which state?',
    options: ['Uttar Pradesh', 'Rajasthan', 'Punjab', 'Bihar'],
    correctIndex: 1,
    image: '/game2/11.jpg',
  },
  {
    kind: 'choice',
    question: 'Chettinad cuisine comes from which state?',
    options: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh'],
    correctIndex: 1,
    image: '/game2/12.jpg',
  },
  {
    kind: 'choice',
    question: 'Rich and creamy kulfi is associated here with which state?',
    options: ['Uttar Pradesh', 'Rajasthan', 'Punjab', 'Gujarat'],
    correctIndex: 0,
    image: '/game2/13.jpg',
  },
  {
    kind: 'choice',
    question: 'Litti Chokha is a famous specialty of which state?',
    options: ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'Madhya Pradesh'],
    correctIndex: 0,
    image: '/game2/14.jpg',
  },
  {
    kind: 'choice',
    question: 'Kathiawadi cuisine is native to which state?',
    options: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Punjab'],
    correctIndex: 1,
    image: '/game2/15.jpg',
  },
  {
    kind: 'choice',
    question: 'Rasgulla is especially famous in which state?',
    options: ['Odisha', 'West Bengal', 'Assam', 'Bihar'],
    correctIndex: 0,
    image: '/game2/02.jpg',
  },
];

const priceRounds: PriceRound[] = [
  {
    kind: 'price',
    question: 'Guess the price of a Costco cheese pizza.',
    price: 9.95,
    image: '/game3/01.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of a Costco rotisserie chicken.',
    price: 4.99,
    image: '/game3/05.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of an 18-pack of Celsius Energy Drinks.',
    price: 28.99,
    image: '/game3/06.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of the El Cerro 17-month whole boneless Serrano ham.',
    price: 169.99,
    image: '/game3/07.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of a 36-count Z-Bar variety pack.',
    price: 26.99,
    image: '/game3/08.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of “The President Casket.”',
    price: 1149.99,
    image: '/game3/11.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of a 12-pack of Bounty Advanced paper towels.',
    price: 29.99,
    image: '/game3/12.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of 152-count Kirkland Ultra Clean laundry detergent.',
    price: 22.99,
    image: '/game3/13.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of 200 Kirkland 13-gallon trash bags.',
    price: 19.99,
    image: '/game3/14.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of a 48-count pack of Kirkland AAA batteries.',
    price: 13.99,
    image: '/game3/15.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of a 3-pack of Crest Pro-Health Advanced mouthwash.',
    price: 12.99,
    image: '/game3/16.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of Kirkland Organic Multivitamins.',
    price: 18.49,
    image: '/game3/17.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of 300 Dixie paper plates.',
    price: 18.99,
    image: '/game3/18.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of a 10-piece Pyrex food storage set.',
    price: 49.99,
    image: '/game3/20.webp',
  },
  {
    kind: 'price',
    question: 'Guess the price of this 4-person barrel sauna.',
    price: 3999.99,
    image: '/game3/25.jpg',
  },
  {
    kind: 'price',
    question: 'Guess the price of this full-size Goliath barn.',
    price: 13499.99,
    image: '/game3/24.jpg',
  },
];

export const games: Record<GameId, GameDefinition> = {
  'game-1': {
    id: 'game-1',
    title: 'Guess the Movie',
    shortTitle: 'Game 1',
    rounds: movieRounds,
  },
  'game-2': {
    id: 'game-2',
    title: 'Taste of India',
    shortTitle: 'Game 2',
    rounds: foodRounds,
  },
  'game-3': {
    id: 'game-3',
    title: 'Name the Price',
    shortTitle: 'Game 3',
    rounds: priceRounds,
  },
};
