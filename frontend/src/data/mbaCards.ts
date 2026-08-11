import { MBACard } from '../types';

export const MBA_CARDS: MBACard[] = [
  {
    id: 'acc-1',
    subject: 'Financial Accounting',
    topic: 'Fundamental Accounting Equation',
    question: 'How do retained earnings and owner equity interact with the fundamental accounting equation?',
    answer: 'Assets = Liabilities + Equity. Equity consists of Contributed Capital + Retained Earnings (Revenues - Expenses - Dividends). Every business transaction has a dual-entry debit and credit impact maintaining this balance.',
    formulaOrInsight: 'Assets = Liabilities + (Beginning Equity + Net Income - Dividends)'
  },
  {
    id: 'quant-1',
    subject: 'Quantitative Methods',
    topic: 'Standard Error & Central Limit Theorem',
    question: 'Why does sample mean distribution approximate a normal distribution regardless of population shape?',
    answer: 'By CLT, for sample size n ≥ 30, the distribution of sample means approaches normal with standard error SE = σ / √n. Increased sample size shrinks the dispersion of estimates proportionally to the square root of n.',
    formulaOrInsight: 'SE = σ / √n | Z = (X̄ - μ) / (σ / √n)'
  },
  {
    id: 'econ-1',
    subject: 'Managerial Economics',
    topic: 'Price Elasticity of Demand (PED)',
    question: 'When PED is inelastic (|Ed| < 1), what happens to total revenue if the firm raises product price?',
    answer: 'Total Revenue increases. Because the percentage drop in quantity demanded is smaller than the percentage increase in price. For elastic demand (|Ed| > 1), raising price lowers total revenue.',
    formulaOrInsight: 'Ed = (% Δ in Quantity Demanded) / (% Δ in Price)'
  },
  {
    id: 'fin-1',
    subject: 'Financial Management',
    topic: 'Net Present Value (NPV) vs IRR',
    question: 'Why is NPV universally preferred over IRR when evaluating mutually exclusive capital projects?',
    answer: 'NPV assumes cash inflows are reinvested at the firm\'s cost of capital (WACC), whereas IRR unrealistically assumes reinvestment at the project\'s internal rate. NPV measures direct wealth addition in currency units.',
    formulaOrInsight: 'NPV = ∑ [ CF_t / (1 + r)^t ] - Initial Outlay'
  },
  {
    id: 'mgmt-1',
    subject: 'Operations & Strategy',
    topic: 'Break-Even Analysis & Contribution Margin',
    question: 'How do you calculate break-even point in units and currency?',
    answer: 'Break-even occurs where Total Revenue equals Total Cost (Zero Operating Profit). Unit Break-Even = Fixed Costs / Unit Contribution Margin (Price - Variable Cost per unit).',
    formulaOrInsight: 'BEP (Units) = Fixed Costs / (Price - Variable Cost)'
  }
];
