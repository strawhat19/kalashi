import './styles.css';
import { Link } from 'expo-router';
import { useRef, type FormEvent } from 'react';
import { ArrowIcon } from '../../../../components/Icons.web';
import { inquiryTopics, useInquiry } from './useInquiry';

const InquiryComposer = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { fields, status, saved, saving, setStatus, updateField, prepareInquiry, saveCurrentInquiry } = useInquiry();
  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveCurrentInquiry();
  };
  const copyInquiry = async () => {
    if (!formRef.current?.reportValidity()) return;
    const message = prepareInquiry();
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setStatus(`Inquiry Copied`);
    } catch {
      setStatus(`Clipboard Unavailable — Use Download Inquiry To Keep Your Message`);
    }
  };
  const downloadInquiry = () => {
    if (!formRef.current?.reportValidity()) return;
    const message = prepareInquiry();
    if (!message) return;
    const url = URL.createObjectURL(new Blob([message], { type: `text/plain;charset=utf-8` }));
    const link = document.createElement(`a`);
    link.href = url;
    link.download = `kalashi-${fields.topic.toLowerCase()}-inquiry.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(`Inquiry Download Started`);
  };

  return <form id={`contact-inquiry-form`} ref={formRef} aria-busy={saving} className={`inquiry-composer`} aria-describedby={`contact-inquiry-disclosure`} onSubmit={(event) => void submitInquiry(event)}>
    <div id={`contact-inquiry-heading`} className={`inquiry-composer__heading`}>
      <span id={`contact-inquiry-number`} className={`info-page__kicker`}>{`YOUR NEXT CONNECTION`}</span>
      <h2 id={`contact-inquiry-title`}>{`Start with an idea.`}</h2>
    </div>
    <p id={`contact-inquiry-disclosure`} className={`inquiry-composer__disclosure`}>{`Keep the details together. Save your inquiry, then copy or download a version whenever you need it.`}</p>
    <div id={`contact-inquiry-fields`} className={`inquiry-composer__fields`}>
      <label id={`contact-topic-label`} className={`inquiry-composer__field`} htmlFor={`contact-topic`}>
        {`What’s on your mind?`}
        <select disabled={saving} id={`contact-topic`} name={`topic`} className={`inquiry-composer__input`} value={fields.topic} onChange={(event) => updateField(`topic`, event.target.value as typeof fields.topic)}>
          {inquiryTopics.map((topic, index) => <option id={`contact-topic-option-${index}`} key={topic} value={topic}>{topic}</option>)}
        </select>
      </label>
      <label id={`contact-name-label`} className={`inquiry-composer__field`} htmlFor={`contact-name`}>
        {`Your name`}
        <input required disabled={saving} id={`contact-name`} name={`name`} maxLength={80} autoComplete={`name`} className={`inquiry-composer__input`} placeholder={`What should we call you?`} value={fields.name} onChange={(event) => updateField(`name`, event.target.value)} />
      </label>
      <label id={`contact-email-label`} className={`inquiry-composer__field inquiry-composer__field--wide`} htmlFor={`contact-email`}>
        {`Reply email`}
        <input required disabled={saving} type={`email`} id={`contact-email`} name={`email`} maxLength={254} autoComplete={`email`} className={`inquiry-composer__input`} placeholder={`you@example.com`} value={fields.email} onChange={(event) => updateField(`email`, event.target.value)} />
      </label>
      <label id={`contact-message-label`} className={`inquiry-composer__field inquiry-composer__field--wide`} htmlFor={`contact-message`}>
        {`Tell us the idea`}
        <textarea required disabled={saving} rows={6} minLength={20} maxLength={5000} id={`contact-message`} name={`message`} className={`inquiry-composer__input inquiry-composer__input--message`} placeholder={`The project, the date, the place. Give the idea some room.`} value={fields.message} onChange={(event) => updateField(`message`, event.target.value)} />
      </label>
    </div>
    <div id={`contact-inquiry-actions`} className={`inquiry-composer__actions`}>
      <button disabled={saving} id={`contact-save-inquiry`} type={`submit`} className={`info-page__button info-page__button--filled`}>{saving ? `Saving…` : `Save Inquiry`}<ArrowIcon size={17} /></button>
      <button disabled={saving} id={`contact-copy-inquiry`} type={`button`} className={`info-page__button`} onClick={() => void copyInquiry()}>{`Copy Inquiry`}<ArrowIcon size={17} /></button>
      <button disabled={saving} id={`contact-download-inquiry`} type={`button`} className={`info-page__button`} onClick={downloadInquiry}>{`Download Inquiry`}<ArrowIcon size={17} /></button>
    </div>
    <p id={`contact-inquiry-status`} role={`status`} aria-live={`polite`} className={`inquiry-composer__status`}>{status || `Add a few details to save your inquiry.`}</p>
    {saved && !saving ? <Link href={`/profile/inquiries`} id={`contact-saved-inquiries`} className={`info-page__text-link`}>{`View Saved Inquiries`}<ArrowIcon size={17} /></Link> : null}
  </form>;
};

export default InquiryComposer;
