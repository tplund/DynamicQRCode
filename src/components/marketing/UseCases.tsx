interface UseCasesProps {
  messages: {
    title: string;
    construction: string;
    constructionDesc: string;
    marketing: string;
    marketingDesc: string;
    packaging: string;
    packagingDesc: string;
  };
}

export default function UseCases({ messages }: UseCasesProps) {
  const cases = [
    {
      title: messages.construction,
      desc: messages.constructionDesc,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 20h20M5 20V8l7-5 7 5v12M9 20v-5h6v5" />
        </svg>
      ),
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: messages.marketing,
      desc: messages.marketingDesc,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: messages.packaging,
      desc: messages.packagingDesc,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
          {messages.title}
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {cases.map((c, i) => (
            <div key={i} className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${c.color}`}>
                {c.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{c.title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
