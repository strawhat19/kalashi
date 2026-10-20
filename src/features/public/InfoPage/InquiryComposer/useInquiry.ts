import { useRef, useState } from 'react';
import { saveInquiry } from '../../../../shared/account/service';
import { useAuth } from '../../../../shared/account/AuthContext';

export const inquiryTopics = [`Booking`, `Collaboration`, `Press`, `General`, `Privacy`] as const;
type InquiryTopic = typeof inquiryTopics[number];
type InquiryFields = { name: string; email: string; message: string; topic: InquiryTopic };

export const useInquiry = () => {
  const { user } = useAuth();
  const pending = useRef(false);
  const draftKey = useRef<string | null>(null);
  const [status, setStatus] = useState(``);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<InquiryFields>({ name: ``, email: ``, message: ``, topic: `Booking` });
  const updateField = <Key extends keyof InquiryFields>(key: Key, value: InquiryFields[Key]) => {
    draftKey.current = null;
    setSaved(false);
    setFields((previous) => ({ ...previous, [key]: value }));
    setStatus(``);
  };
  const prepareInquiry = () => {
    if (!fields.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(fields.email.trim()) || fields.message.trim().length < 20) {
      setStatus(`Add your name, a valid email, and at least 20 characters about your inquiry`);
      return null;
    }
    return `KALASHI MUSIC / ${fields.topic.toUpperCase()}\n\nName: ${fields.name.trim()}\nReply Email: ${fields.email.trim()}\n\n${fields.message.trim()}\n\nPrepared with Kalashi Music`;
  };
  const saveCurrentInquiry = async () => {
    if (pending.current || !prepareInquiry()) return false;
    pending.current = true;
    draftKey.current ??= `inquiry-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    setSaving(true);
    setStatus(`Saving Inquiry`);
    try {
      const result = await saveInquiry(fields, {
        ownerId: user?.id ?? `guest`,
        idempotencyKey: draftKey.current,
      });
      if (!result.success) {
        setStatus(result.error);
        return false;
      }
      setSaved(true);
      setStatus(result.persisted ? `Inquiry Saved` : `Inquiry Saved For This Session`);
      return true;
    } catch {
      setStatus(`Could Not Save Inquiry — Please Try Again`);
      return false;
    } finally {
      pending.current = false;
      setSaving(false);
    }
  };
  return { fields, status, saved, saving, setStatus, updateField, prepareInquiry, saveCurrentInquiry };
};
