const GENRES = ['Action','Sports','Shooter','Role-Playing','Racing','Platform','Misc','Fighting','Simulation','Strategy','Adventure','Puzzle']
const PLATFORMS = ['PS2','X360','PS3','Wii','DS','PS','GBA','PC','PSP','PS4','XB','GB','NES','SNES']

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Sök spel..."
        value={filters.search}
        onChange={e => onChange({ ...filters, search: e.target.value })}
        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
      />
      <select
        value={filters.genre}
        onChange={e => onChange({ ...filters, genre: e.target.value })}
        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
      >
        <option value="">Alla genrer</option>
        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
      <select
        value={filters.platform}
        onChange={e => onChange({ ...filters, platform: e.target.value })}
        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
      >
        <option value="">Alla plattformar</option>
        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  )
}
