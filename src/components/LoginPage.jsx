export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl border border-gray-800">
        <div className="text-5xl">🎮</div>
        <h1 className="text-3xl font-bold text-white">VG Sales Explorer</h1>
        <p className="text-gray-400 text-center max-w-xs">
          Utforska 16 000+ videospel och deras försäljningsdata globalt
        </p>

        <a
          href="https://vgsales-backend-production.up.railway.app/auth/google"
          className="flex items-center gap-3 bg-white text-gray-800 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Logga in med Google
        </a>
      </div>
    </div>
  )
}
