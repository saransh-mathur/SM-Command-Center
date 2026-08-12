import { RouletteTask } from '../types';

export const ROULETTE_TASKS: RouletteTask[] = [
  {
    id: 'rt-job-1',
    track: 'job',
    title: 'Find 1 Tech Recruiter on LinkedIn & Save Profile',
    description: 'Search for "Technical Recruiter Stripe / Coinbase" on LinkedIn. Save their profile link to your Job Hunt pipeline notes.',
    estimatedMinutes: 2,
    actionText: 'Open LinkedIn & Save Link',
    advisorTip: '@Tsuna: Zero outcome pressure. Just bookmark one name and your subconscious will start familiarizing with the team.',
    targetKey: 'applications',
  },
  {
    id: 'rt-udemy-1',
    track: 'udemy',
    title: 'Watch 1 Video at 1.5x Speed & Write 3 Lines of Code',
    description: 'Open your current Udemy module, set playback speed to 1.5x, and write 3-5 lines of code or comments in your editor.',
    estimatedMinutes: 5,
    actionText: 'Launch Course Sprint',
    advisorTip: '@Sky: Keep playback at 1.5x with terminal active. Visual focus on code prevents passive daydreaming.',
    targetKey: 'udemySprints',
  },
  {
    id: 'rt-mba-1',
    track: 'mba',
    title: 'Flip 2 Financial Accounting Flashcards',
    description: 'Open the MBA Copilot / Knowledge Gym and test yourself on the fundamental accounting equation and current ratio.',
    estimatedMinutes: 2,
    actionText: 'Flip MBA Flashcard',
    advisorTip: '@Ren: Active retrieval builds neural scaffolding. Recall the answer *before* flipping the card.',
    targetKey: 'mbaRecall',
  }
];
