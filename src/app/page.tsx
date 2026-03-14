export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">DynamicQR</h1>
        <p className="text-gray-600 mb-8">Dynamiske QR-koder med custom branding</p>
        <a
          href="/admin"
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Gå til admin
        </a>
      </div>
    </div>
  );
}
