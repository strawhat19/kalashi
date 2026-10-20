export const cleanText = (value: unknown, limit: number) => typeof value === `string` ? value.trim().slice(0, limit) : ``;

const recordUUID = () => {
  if (typeof globalThis.crypto?.randomUUID === `function`) return globalThis.crypto.randomUUID();
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/gu, character => {
    const value = Math.floor(Math.random() * 16);
    return (character === `x` ? value : value & 3 | 8).toString(16);
  });
};

export const createRecordId = (type: string, number: number, name: string, date = new Date().toISOString()) => {
  const slug = cleanText(name, 48).replace(/[^a-zA-Z0-9]+/gu, `-`).replace(/^-|-$/gu, ``) || `Record`;
  return `${type}_${number}_${slug}_${date.slice(0, 10)}_${recordUUID()}`;
};
