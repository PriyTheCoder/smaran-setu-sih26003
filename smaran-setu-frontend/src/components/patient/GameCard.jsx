import { Link } from 'react-router-dom'

export default function GameCard({ game }) {
  const Icon = game?.icon

  return (
    <Link
      to={`/user/games/${game?.id}`}
      className="card group block p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Top section */}
      <div className="flex items-start justify-between gap-4">
        {/* Game icon */}
        <div className="rounded-2xl bg-blue-100 p-4 text-[#2f8f92] transition-transform duration-300 group-hover:scale-105">
          {Icon && <Icon size={30} />}
        </div>

        {/* Duration */}
        <span className="rounded-full bg-slate-100 px-5 py-3 text-xs font-bold text-black">
          {game?.duration}
        </span>
      </div>

      {/* Game title */}
      <h3 className="mt-5 text-xl font-bold text-[#17345f]">
        {game?.title}
      </h3>

      {/* Description */}
      <p className="mt-2 min-h-12 text-sm leading-6 black">
        {game?.description}
      </p>

      {/* Play button */}
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-xl bg-sky-600 px-5 py-3 font-bold text-white transition-colors duration-200 group-hover:bg-sky-600">
          Play →
        </span>

        <span className="text-xs font-bold black">
          Cognitive Game
        </span>
      </div>
    </Link>
  )
}