import { useEffect, useState } from 'react';

const useBrandFonts = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const finish = () => { if (active) setReady(true); };
    if (!document.fonts) finish();
    else Promise.all([
      document.fonts.load(`400 16px Anton`),
      document.fonts.load(`400 16px SpaceGrotesk`),
    ]).then(finish, finish);
    return () => { active = false; };
  }, []);

  return ready;
};

export default useBrandFonts;
