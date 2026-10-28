import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const directory = path.join(process.cwd(), 'content');
function read(file: string) {
  const { data, content } = matter(fs.readFileSync(path.join(directory, file), 'utf8'));
  return { data, body: content.trim() };
}
function required(data: Record<string, unknown>, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`content/${file}: ${key} must be non-empty text.`);
  }
  return value;
}
function date(data: Record<string, unknown>, key: string, file: string) {
  const value = required(data, key, file);
  if (/^\d{4}$/.test(value)) return value;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`content/${file}: ${key} must be a quoted YYYY-MM-DD date or YYYY year.`);
  }
  return value;
}
function verificationUrl(data: Record<string, unknown>, file: string) {
  if (data.verificationUrl === undefined) return undefined;
  const value = required(data, 'verificationUrl', file);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${file}: verificationUrl must be an absolute HTTPS URL.`);
  }
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error(`${file}: verificationUrl must be an absolute HTTPS URL without credentials.`);
  }
  return url.href;
}

export function getSite() {
  const { data, body } = read('README.md');
  return {
    name: required(data, 'name', 'README.md'),
    title: required(data, 'title', 'README.md'),
    headline: required(data, 'headline', 'README.md'),
    description: required(data, 'description', 'README.md'),
    footer: required(data, 'footer', 'README.md'),
    body,
  };
}
export function getCertificates() {
  return fs
    .readdirSync(path.join(directory, 'certificates'))
    .filter((file) => file.endsWith('.md'))
    .flatMap((filename) => {
      const source = `certificates/${filename}`;
      const { data, body } = read(source);
      if (data.draft !== undefined && typeof data.draft !== 'boolean')
        throw new Error(`${source}: draft must be true or false.`);
      if (data.draft === true) return [];
      const file = data.file === undefined ? undefined : required(data, 'file', source);
      const url = verificationUrl(data, source);
      if (!file && !url)
        throw new Error(`${source}: provide a certificate file or verificationUrl.`);
      if (
        file &&
        (!/^\/certificates\/[A-Za-z0-9_-]+\.(pdf|jpe?g)$/.test(file) ||
          !fs.existsSync(path.join(process.cwd(), 'public', file)))
      )
        throw new Error(
          `${source}: file must reference an existing PDF or JPEG in public/certificates.`,
        );
      const issued = date(data, 'issued', source);
      const stem = filename.replace(/\.md$/, '');
      if (
        !stem.startsWith(`${issued}-`) ||
        !/^\d{4}(?:-\d{2}-\d{2})?-[a-z0-9]+(?:-[a-z0-9]+)+$/.test(stem) ||
        (file !== undefined && path.basename(file, path.extname(file)) !== stem)
      ) {
        throw new Error(
          `${source}: use matching YYYY-MM-DD-issuer-credential (or YYYY-issuer-credential for year-only dates) names for the Markdown and certificate file, with the issued date and lowercase hyphenated words.`,
        );
      }
      const validThrough =
        data.validThrough === undefined ? undefined : date(data, 'validThrough', source);
      if (validThrough && validThrough < issued)
        throw new Error(`${source}: validity cannot end before issue.`);
      return [
        {
          id: filename.replace(/\.md$/, ''),
          title: required(data, 'title', source),
          issuer: required(data, 'issuer', source),
          mark: required(data, 'mark', source),
          category: required(data, 'category', source),
          issued,
          validThrough,
          verificationUrl: url,
          file,
          body,
        },
      ];
    })
    .sort((a, b) => b.issued.localeCompare(a.issued) || a.id.localeCompare(b.id));
}
export type Certificate = ReturnType<typeof getCertificates>[number];
export function formatDate(value: string) {
  if (/^\d{4}$/.test(value)) return value;
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}
