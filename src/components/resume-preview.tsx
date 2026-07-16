import type { Ref } from "react";
import type { Resume } from "@/domain/resume";
import { contactLine, dateRange, entryLine, resumeLabels } from "@/domain/resume-content";

type Props = {
  resume: Resume;
  onChange?: (next: Resume) => void;
  paperRef?: Ref<HTMLElement>;
};

export function ResumePreview({ resume, onChange, paperRef }: Props) {
  const text = resumeLabels[resume.language];
  const contacts = contactLine(resume);
  const editable = Boolean(onChange);
  const editText = (value: string, commit: (clean: string) => void) => {
    if (!editable) return undefined;
    return {
      contentEditable: true,
      suppressContentEditableWarning: true,
      role: "textbox",
      tabIndex: 0,
      onBlur: (event: React.FocusEvent<HTMLElement>) => commit(event.currentTarget.innerText.trim()),
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") event.currentTarget.blur();
      },
    };
  };

  return (
    <article ref={paperRef} className={`resume-paper ${editable ? "editable-preview" : ""}`} aria-label="Pratinjau resume">
      <header className="resume-header">
        <h1 {...editText(resume.contact.fullName, (fullName) => onChange?.({ ...resume, contact: { ...resume.contact, fullName } }))}>{resume.contact.fullName || "Nama Lengkap"}</h1>
        {resume.targetRole ? <p className="target-role" {...editText(resume.targetRole, (targetRole) => onChange?.({ ...resume, targetRole }))}>{resume.targetRole}</p> : null}
        <p className="contact-line">{contacts}</p>
      </header>
      {resume.summary.trim() ? <ResumeSection title={text.summary}><p {...editText(resume.summary, (summary) => onChange?.({ ...resume, summary }))}>{resume.summary}</p></ResumeSection> : null}
      {resume.skills.trim() ? <ResumeSection title={text.skills}><p {...editText(resume.skills, (skills) => onChange?.({ ...resume, skills }))}>{resume.skills}</p></ResumeSection> : null}
      {resume.experiences.length ? <ResumeSection title={text.experience}>{resume.experiences.map((item) => <div className="resume-entry" key={item.id}><p className="entry-heading"><strong>{entryLine(item.role, item.company, dateRange(item.startDate, item.endDate, text.present))}</strong></p>{item.location ? <p className="entry-subline">{item.location}</p> : null}<ul>{item.bullets.filter((bullet) => bullet.text.trim()).map((bullet) => <li key={bullet.id} {...editText(bullet.text, (textValue) => onChange?.({ ...resume, experiences: resume.experiences.map((experience) => ({ ...experience, bullets: experience.bullets.map((entry) => entry.id === bullet.id ? { ...entry, text: textValue } : entry) })) }))}>{bullet.text}</li>)}</ul></div>)}</ResumeSection> : null}
      {resume.education.length ? <ResumeSection title={text.education}>{resume.education.map((item) => <div className="resume-entry" key={item.id}><p className="entry-heading"><strong>{entryLine(item.degree, item.institution, item.graduationDate)}</strong></p>{item.location ? <p className="entry-subline">{item.location}</p> : null}</div>)}</ResumeSection> : null}
      {resume.projects.length ? <ResumeSection title={text.projects}>{resume.projects.map((item) => <div className="resume-entry" key={item.id}><p className="entry-heading"><strong>{entryLine(item.name, item.technologies, item.date)}</strong></p><ul>{item.bullets.filter((bullet) => bullet.text.trim()).map((bullet) => <li key={bullet.id} {...editText(bullet.text, (textValue) => onChange?.({ ...resume, projects: resume.projects.map((project) => ({ ...project, bullets: project.bullets.map((entry) => entry.id === bullet.id ? { ...entry, text: textValue } : entry) })) }))}>{bullet.text}</li>)}</ul></div>)}</ResumeSection> : null}
      {resume.certifications.trim() ? <ResumeSection title={text.certifications}><p {...editText(resume.certifications, (certifications) => onChange?.({ ...resume, certifications }))}>{resume.certifications}</p></ResumeSection> : null}
    </article>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="resume-section"><h2>{title}</h2>{children}</section>;
}
