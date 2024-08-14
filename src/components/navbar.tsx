import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-border h-16">
      <div className="container items-center flex h-full">
        <Link href="/" className="text-3xl text-amber-400">
          Time Tracker
        </Link>
      </div>
    </nav>
  );
}
