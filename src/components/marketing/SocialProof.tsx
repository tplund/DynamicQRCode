interface SocialProofProps {
  messages: {
    qrCodes: string;
    scans: string;
    countries: string;
  };
}

export default function SocialProof({ messages }: SocialProofProps) {
  const metrics = [
    {
      value: "500+",
      label: messages.qrCodes,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="3" height="3" />
          <rect x="18" y="18" width="3" height="3" />
        </svg>
      ),
    },
    {
      value: "50,000+",
      label: messages.scans,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      value: "30+",
      label: messages.countries,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="border-y border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {metrics.map((metric, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-gray-400">{metric.icon}</div>
              <div>
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
