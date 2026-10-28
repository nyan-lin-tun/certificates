const icons = {
  kubernetes: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v8m0 4v8M2 12h8m4 0h8M5 5l5.5 5.5m3 3L19 19M5 19l5.5-5.5m3-3L19 5" />
    </>
  ),
  shield: <path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Zm-4 9 3 3 5-6" />,
  cloud: <path d="M7 18a5 5 0 1 1 0-10 6 6 0 0 1 11-1 5.5 5.5 0 0 1 0 11H7Z" />,
  network: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M6 16v-4h12v4" />
    </>
  ),
  code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />,
  layers: <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />,
  chart: <path d="M4 3v17h17M8 16v-4m5 4V8m5 8V5" />,
  mobile: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M10 5h4M11 19h2" />
    </>
  ),
  devops: (
    <path d="M12 12c-3-5-4-6-6-6a6 6 0 0 0 0 12c2 0 3-1 6-6Zm0 0c3-5 4-6 6-6a6 6 0 0 1 0 12c-2 0-3-1-6-6Z" />
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="5" />
      <path d="m8 12-2 9 6-3 6 3-2-9" />
    </>
  ),
};

const categoryIcons: Record<string, keyof typeof icons> = {
  Kubernetes: 'kubernetes',
  'Cloud native': 'kubernetes',
  'Cloud security': 'shield',
  'Cloud architecture': 'cloud',
  'Cloud infrastructure': 'cloud',
  'Cloud development': 'cloud',
  Networking: 'network',
  'Infrastructure as code': 'layers',
  'Data science': 'chart',
  Algorithms: 'code',
  'Computer science': 'code',
  'Mobile development': 'mobile',
  DevOps: 'devops',
};

export function CertificateIcon({ category }: { category: string }) {
  return (
    <span className="project-mark" aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {icons[categoryIcons[category] ?? 'award']}
      </svg>
    </span>
  );
}
