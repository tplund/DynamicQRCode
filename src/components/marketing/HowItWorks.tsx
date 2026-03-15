interface HowItWorksProps {
  messages: {
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
}

const steps = [
  {
    num: "1",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    num: "2",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    num: "3",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
      </svg>
    ),
  },
];

export default function HowItWorks({ messages }: HowItWorksProps) {
  const stepData = [
    { title: messages.step1Title, desc: messages.step1Desc },
    { title: messages.step2Title, desc: messages.step2Desc },
    { title: messages.step3Title, desc: messages.step3Desc },
  ];

  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
          {messages.title}
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {stepData.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-gray-900 shadow-sm ring-1 ring-gray-100">
                {steps[i].icon}
              </div>
              <div className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                {steps[i].num}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{step.desc}</p>

              {/* Connector arrow (hidden on last) */}
              {i < 2 && (
                <div className="absolute top-8 -right-4 hidden text-gray-300 md:block">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
