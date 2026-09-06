import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Line snapped</p>
      <h1 className="mt-2 text-5xl text-navy">404</h1>
      <p className="mt-3 max-w-md text-ink/70">
        That one got off the hook. The page you&apos;re looking for isn&apos;t here.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-navy">
          Back home
        </Link>
        <Link href="/soft-plastics" className="btn-outline">
          Shop soft plastics
        </Link>
      </div>
    </div>
  );
}
