import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linen px-6">
      <div className="text-center max-w-lg">
        <p className="text-label uppercase text-driftwood mb-4">404</p>
        <h1 className="text-display-md font-serif font-light text-ink mb-4">
          Page not found
        </h1>
        <p className="text-body-lg text-driftwood mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
