import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const prefix = '/certificates';
const html = fs
  .readFileSync('out/index.html', 'utf8')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;');

test('static export resolves every local asset and certificate beneath the Pages base path', () => {
  for (const filename of ['index.html', '404.html']) {
    const page = fs.readFileSync(path.join('out', filename), 'utf8');
    for (const [, reference] of page.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) {
      assert.ok(reference.startsWith(`${prefix}/`), `Outside base path: ${reference}`);
      let relative = reference.slice(prefix.length + 1).split('?')[0];
      if (!relative || relative.endsWith('/')) relative += 'index.html';
      assert.ok(fs.existsSync(path.join('out', relative)), `Missing asset: ${reference}`);
    }
  }
  assert.ok(fs.existsSync('out/.nojekyll'));
});

test('published Markdown entries render with dates and byte-identical certificate files', () => {
  for (const filename of fs
    .readdirSync('content/certificates')
    .filter((file) => file.endsWith('.md'))) {
    const { data } = matter(fs.readFileSync(path.join('content/certificates', filename), 'utf8'));
    if (data.draft) continue;
    assert.ok(html.includes(escapeHtml(data.title)), `Missing title: ${filename}`);
    assert.ok(
      html.includes(`dateTime="${data.issued}"`) || html.includes(`datetime="${data.issued}"`),
    );
    if (data.file) assert.ok(html.includes(`href="${prefix}${data.file}"`));
    else assert.ok(data.verificationUrl, `Badge requires a public credential URL: ${filename}`);
    if (data.verificationUrl) {
      assert.ok(
        html.includes(`href="${escapeHtml(new URL(data.verificationUrl).href)}"`),
        `Missing verification link: ${filename}`,
      );
      const article = html.match(
        new RegExp(
          `<article\\b[^>]*aria-labelledby="${filename.replace(/\.md$/, '')}"[^>]*>([\\s\\S]*?)</article>`,
        ),
      )?.[1];
      assert.ok(article, `Missing certificate article: ${filename}`);
      assert.ok(article.includes('Verify credential'));
    }
    if (data.file) {
      assert.deepEqual(
        fs.readFileSync(path.join('public', data.file)),
        fs.readFileSync(path.join('out', data.file)),
      );
    }
  }
});

test('verification links never send visitors to general lookup forms', () => {
  for (const portal of [
    'https://www.cisco.com/go/verifycertificate',
    'https://www.mikrotik.com/certificates/',
    'https://aws.amazon.com/verification',
    'https://training.linuxfoundation.org/certification/verify',
  ]) {
    assert.ok(!html.includes(`href="${portal}"`), `General portal rendered: ${portal}`);
  }
  assert.ok(!html.includes('Verification portal'));
});
