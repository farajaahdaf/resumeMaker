A resume builder that generates tailored, ATS-friendly resumes from structured user input.

- Provide a guided form with sections for experience, education, skills, and projects.
- Offer multiple professional, single-column ATS-safe templates with live preview.
- Allow export to text-based PDF, DOCX, and JSON for easy sharing and importing.
- Automatically parse keywords from a job description to customize the resume without inventing qualifications or keyword stuffing.
- Validate exported files by checking extracted text and reading order.
- Use DeepSeek as a server-side writing and analysis assistant. AI output is always treated as a proposed change, never as verified user data.
- Validate every AI response against a strict schema and flag unsupported skills, employers, credentials, dates, and metrics before showing it to the user.

## Product documentation

- [Product Requirements Document](PRD.md)
- [ATS-friendly resume format and implementation specification](docs/ATS_FRIENDLY_RESUME_SPEC.md)
- [DeepSeek AI integration specification](docs/DEEPSEEK_AI_INTEGRATION_SPEC.md)
