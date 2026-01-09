export function Footer() {
  return (
    <footer className="bg-ink text-linen py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-serif text-2xl font-light">
            Filipa & Duarte
          </div>

          <div className="text-center md:text-right">
            <p className="text-body text-linen/70">
              12 de Setembro de 2026 · Comporta, Portugal
            </p>
            <p className="text-label-sm text-linen/40 mt-2">
              We'll only use your information for wedding planning.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
