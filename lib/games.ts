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

export type GameRound = ImageRound | ChoiceRound;
export type GameId = 'game-1' | 'game-2';

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
        ? '/game1/page-13-dangal.jpg'
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
    question: 'Rasgulla is especially famous in which state?',
    options: ['Odisha', 'West Bengal', 'Assam', 'Bihar'],
    correctIndex: 1,
    image: '/game2/02.jpg',
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
    question: 'Hyderabadi-style biryani points to which state?',
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
};
