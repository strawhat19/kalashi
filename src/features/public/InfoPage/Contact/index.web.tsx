import { Link } from 'expo-router';
import { infoContent } from '../content';
import InquiryComposer from '../InquiryComposer';
import { ArrowIcon } from '../../../../components/Icons.web';
import SplitText from '../../../../components/motion/SplitText.web';

const briefNotes = [
  { title: `FOR THE STAGE`, category: `Booking`, detail: `The date. The city. The room.` },
  { title: `FOR A SHARED SOUND`, category: `Collaboration`, detail: `The idea. The people. The direction.` },
  { title: `FOR THE STORY`, category: `Press`, detail: `The publication. The angle. The deadline.` },
];

const Contact = ({ ready }: { ready: boolean }) => <>
  <header id={`contact-hero`} className={`creative-hero`} data-page-hero>
    <div id={`contact-desk-register`} className={`creative-register`}><p id={`contact-eyebrow`} className={`info-page__kicker`}>{`THE CREATIVE DESK / KALASHI MUSIC`}</p><span>{`IDEAS WELCOME ↙`}</span></div>
    <h1 id={`contact-title`}><SplitText ready={ready} text={`LET’S MAKE`} /><span><SplitText ready={ready} delay={120} text={`SOMETHING.`} /></span></h1>
    <div id={`contact-hero-bottom`} className={`creative-hero__bottom`}><p id={`contact-description`}>{infoContent.contact.description}</p><span className={`creative-asterisk`} aria-hidden={`true`}>{`✳`}</span></div>
  </header>
  <div id={`contact-body`} className={`creative-desk`}>
    <aside id={`contact-brief-guide`} className={`creative-brief`} aria-labelledby={`contact-brief-title`}>
      <span className={`creative-brief__tab`}>{`BEFORE YOU WRITE`}</span>
      <h2 id={`contact-brief-title`}>{`A little detail.`}<br />{`A lot of possibility.`}</h2>
      <p>{infoContent.contact.sections[0].paragraphs[0]}</p>
      <ol id={`contact-project-notes`} className={`creative-notes`}>
        {briefNotes.map((note, index) => <li id={`contact-note-${index}`} key={note.category}><span>{`0${index + 1} / ${note.category}`}</span><h3>{note.title}</h3><p>{note.detail}</p></li>)}
      </ol>
      <div id={`contact-records-note`} className={`creative-records-note`}><p>{infoContent.contact.sections[1].paragraphs[0]}</p><Link id={`contact-saved-link`} href={`/profile/inquiries`} className={`info-page__text-link`}>{`Your Saved Inquiries`}<ArrowIcon size={18} /></Link></div>
    </aside>
    <div id={`contact-writing-desk`} className={`creative-form-wrap`}><InquiryComposer /></div>
  </div>
</>;

export default Contact;
