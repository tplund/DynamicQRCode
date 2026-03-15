interface FeaturesProps {
  messages: {
    title: string;
    analytics: string;
    analyticsDesc: string;
    branding: string;
    brandingDesc: string;
    dynamic: string;
    dynamicDesc: string;
    alerts: string;
    alertsDesc: string;
    export: string;
    exportDesc: string;
    api: string;
    apiDesc: string;
  };
}

const featureIcons = [
  // Analytics
  <svg key="analytics" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" />
  </svg>,
  // Branding
  <svg key="branding" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="13.5" cy="6.5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="12" r="2.5" />
    <circle cx="13.5" cy="17.5" r="2.5" />
    <path d="M15.5 8.5l2-2M8 10l4-2M8 14l4 2M15.5 15.5l2 2" />
  </svg>,
  // Dynamic
  <svg key="dynamic" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
  </svg>,
  // Alerts
  <svg key="alerts" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>,
  // Export
  <svg key="export" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>,
  // API
  <svg key="api" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
];

export default function Features({ messages }: FeaturesProps) {
  const features = [
    { title: messages.analytics, desc: messages.analyticsDesc },
    { title: messages.branding, desc: messages.brandingDesc },
    { title: messages.dynamic, desc: messages.dynamicDesc },
    { title: messages.alerts, desc: messages.alertsDesc },
    { title: messages.export, desc: messages.exportDesc },
    { title: messages.api, desc: messages.apiDesc },
  ];

  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
          {messages.title}
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                {featureIcons[i]}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
