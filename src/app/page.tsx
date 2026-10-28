import type { Metadata } from 'next';
import { getCertificates, getSite } from '../lib/content';
import { CertificateList } from '../components/certificate-list';
import { Markdown } from '../components/markdown';

export const metadata: Metadata = {
  alternates: { canonical: 'https://nyanlintun.me/certificates/' },
};

export default function CertificatesPage() {
  const site = getSite();
  const certificates = getCertificates();
  return (
    <>
      <section className="intro pt-10 sm:pt-12">
        <h1 className="max-w-4xl text-3xl leading-snug font-normal tracking-tight sm:text-[2.4rem]">
          {site.headline}
        </h1>
        {site.body && (
          <div className="intro-copy mt-6 max-w-xl text-sm leading-7 text-muted">
            <Markdown>{site.body}</Markdown>
          </div>
        )}
      </section>
      <CertificateList certificates={certificates} />
    </>
  );
}
