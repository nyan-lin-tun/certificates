import { type Certificate, formatDate } from '../lib/content';
import { assetPath } from '../lib/site';
import { Markdown } from './markdown';
import { CertificateIcon } from './certificate-icon';

export function CertificateList({ certificates }: { certificates: Certificate[] }) {
  return (
    <ol className="timeline mt-20 sm:mt-28" aria-label="Certificate timeline">
      {certificates.map((certificate) => (
        <li className="timeline-entry" key={certificate.id}>
          <div className="date-rail">
            <span className="timeline-dot" aria-hidden="true" />
            <p className="date-range">
              <time dateTime={certificate.issued}>{formatDate(certificate.issued)}</time>
            </p>
          </div>
          <article className="entry-body pb-16 sm:pb-20" aria-labelledby={certificate.id}>
            <h2
              id={certificate.id}
              className="entry-title flex flex-wrap items-baseline gap-x-2 text-lg leading-relaxed sm:text-xl"
            >
              <CertificateIcon category={certificate.category} />
              <a
                className="project-link"
                href={certificate.file ? assetPath(certificate.file) : certificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${certificate.mark} ${certificate.file ? 'certificate' : 'badge'} (opens in a new tab)`}
              >
                {certificate.title}
                <span className="link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <span className="text-muted">— {certificate.issuer}</span>
            </h2>
            {certificate.validThrough && (
              <p className="entry-status">
                Valid through{' '}
                <time dateTime={certificate.validThrough}>
                  {formatDate(certificate.validThrough)}
                </time>
              </p>
            )}
            <Markdown>{certificate.body}</Markdown>
            {certificate.verificationUrl && (
              <a
                className="project-link text-sm text-accent"
                href={certificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${certificate.mark} credential (opens in a new tab)`}
              >
                Verify credential
                <span className="link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            )}
          </article>
        </li>
      ))}
    </ol>
  );
}
