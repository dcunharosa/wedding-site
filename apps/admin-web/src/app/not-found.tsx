import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linen px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-sky/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-sky font-serif text-2xl">404</span>
        </div>
        <h1 className="text-display-md font-serif font-light text-ink mb-4">
          Page not found
        </h1>
        <p className="text-driftwood mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
