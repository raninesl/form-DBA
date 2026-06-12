import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="https://dbageneve.com" className="flex items-center gap-6">
            <img 
              src="/logo.png" 
              alt="Logo DBA Genève" 
              className="h-24 w-auto" 
            />
            <div className="hidden sm:block">
              <h1 className="text-3xl font-bold text-primary font-serif">
                DBA Genève Global Institute
              </h1>
              <p className="text-base text-grayMedium">
                École Doctorale
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
