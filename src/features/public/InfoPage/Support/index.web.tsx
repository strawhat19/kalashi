import { Link } from 'expo-router';
import { useSupport, supportCategories } from './useSupport';
import { ArrowIcon } from '../../../../components/Icons.web';
import SplitText from '../../../../components/motion/SplitText.web';

const Support = ({ ready }: { ready: boolean }) => {
  const { open, query, reset, toggle, setQuery, category, questions, setCategory } = useSupport();

  return <>
    <header id={`support-hero`} className={`field-hero`} data-page-hero>
      <div className={`field-hero__label`}><p id={`support-eyebrow`} className={`info-page__kicker`}>{`THE LISTENER’S FIELD GUIDE`}</p><span>{`HELP / 01—05`}</span></div>
      <h1 id={`support-title`}><SplitText ready={ready} text={`BACK TO`} /><span><SplitText ready={ready} delay={100} text={`YOUR SOUND.`} /></span></h1>
      <div className={`field-hero__bottom`}><p id={`support-description`}>{`A few good answers. Less searching around. More finding your frequency.`}</p><span className={`field-guide-mark`} aria-hidden={`true`}>{`↙`}</span></div>
    </header>
    <div id={`support-body`} className={`field-guide`}>
      <aside id={`support-search-desk`} className={`field-search`} aria-label={`Find a help topic`}>
        <label id={`support-search-label`} htmlFor={`support-search`}>{`WHAT DO YOU NEED?`}</label>
        <div className={`field-search__input-wrap`}><span aria-hidden={`true`}>{`⌕`}</span><input type={`search`} id={`support-search`} value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search the guide…`} autoComplete={`off`} aria-controls={`support-questions`} /></div>
        <div id={`support-categories`} className={`field-categories`} aria-label={`Help categories`}>
          {supportCategories.map((item, index) => <button id={`support-category-${index}`} key={item} type={`button`} aria-pressed={category === item} onClick={() => setCategory(item)}><span>{item}</span><span aria-hidden={`true`}>{category === item ? `↗` : `+`}</span></button>)}
        </div>
        <Link id={`support-contact-link`} href={`/contact`} className={`field-contact`}><span>{`A DIFFERENT QUESTION?`}</span><strong>{`Put it into words.`}<ArrowIcon size={23} /></strong></Link>
      </aside>
      <section id={`support-questions`} className={`field-questions`} aria-label={`Frequently asked questions`}>
        <div className={`field-results`}><span>{category === `All` ? `THE ESSENTIALS` : category.toUpperCase()}</span><span role={`status`} aria-live={`polite`}>{`${questions.length} ${questions.length === 1 ? `ANSWER` : `ANSWERS`}`}</span></div>
        {questions.map(question => <article id={question.id} key={question.id} className={`field-question${open.includes(question.index) ? ` is-open` : ``}`}>
          <h2><button type={`button`} id={`${question.id}-toggle`} aria-expanded={open.includes(question.index)} aria-controls={`${question.id}-answer`} onClick={() => toggle(question.index)}><span className={`field-question__number`}>{`0${question.index + 1}`}</span><span>{question.title}</span><span className={`field-question__toggle`} aria-hidden={`true`}>{`+`}</span></button></h2>
          <div id={`${question.id}-answer`} className={`field-answer`} role={`region`} aria-labelledby={`${question.id}-toggle`} hidden={!open.includes(question.index)}>{question.paragraphs.map((paragraph, index) => <p id={`${question.id}-paragraph-${index}`} key={index}>{paragraph}</p>)}</div>
        </article>)}
        {questions.length === 0 ? <div id={`support-empty`} className={`field-empty`}><span aria-hidden={`true`}>{`?`}</span><h2>{`A different frequency.`}</h2><p>{`No answers match that search. Try another word or explore every topic.`}</p><button id={`support-reset`} type={`button`} className={`info-page__button`} onClick={reset}>{`Show All Topics`}<ArrowIcon size={16} /></button></div> : null}
      </section>
    </div>
  </>;
};

export default Support;
