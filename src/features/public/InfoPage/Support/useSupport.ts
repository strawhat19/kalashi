import { useState } from 'react';
import { infoContent } from '../content';

export const supportCategories = [`All`, `Playback`, `Sound Lab`, `Library`, `Account`, `Inquiries`] as const;
export type SupportCategory = typeof supportCategories[number];
export const supportQuestions = infoContent.support.sections.map((section, index) => ({
  ...section,
  index,
  id: `support-question-${index}`,
  category: supportCategories[index + 1] ?? `All`,
}));

export const useSupport = () => {
  const [query, setQuery] = useState(``);
  const [open, setOpen] = useState<number[]>([0]);
  const [category, setCategory] = useState<SupportCategory>(`All`);
  const search = query.trim().toLowerCase();
  const questions = supportQuestions.filter(question =>
    (category === `All` || question.category === category) &&
    (!search || [question.title, ...question.paragraphs].join(` `).toLowerCase().includes(search)),
  );
  const toggle = (index: number) => setOpen(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
  const reset = () => { setQuery(``); setCategory(`All`); };

  return { open, query, reset, toggle, setQuery, category, questions, setCategory };
};
