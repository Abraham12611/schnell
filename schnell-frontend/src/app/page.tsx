import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl" style={{ letterSpacing: '-0.25px' }}>
        Lowest Fees
        <span className="block sm:inline text-brand-teal"> Fastest Speeds</span>
        <span className="block">on Mantle</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
        Experience extraordinarily fast and cost-effective cross-chain bridging, secured by an intents-based architecture. Send and receive stablecoins globally with Schnell.
      </p>
      <div className="mt-10">
        <Link
          href="/bridge" // This will later navigate to the main bridge app interface
          className="px-8 py-4 text-lg font-semibold text-brand-charcoal bg-brand-teal rounded-md shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 focus:ring-offset-brand-charcoal"
        >
          Bridge Now
        </Link>
      </div>
      <div className="mt-12 text-sm text-gray-400">
        <p>Avg settlement &lt; 30 sec • Fee &lt; $0.01</p>
        {/* TODO: Add live Mantle baseFee + block time */}
      </div>
    </div>
  );
}
