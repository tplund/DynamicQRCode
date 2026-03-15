import Link from "next/link";

interface FinalCTAProps {
  messages: {
    title: string;
    subtitle: string;
    cta: string;
  };
}

export default function FinalCTA({ messages }: FinalCTAProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="rounded-3xl bg-gray-900 px-8 py-16 md:px-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {messages.title}
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            {messages.subtitle}
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-lg hover:bg-gray-100 transition-colors"
          >
            {messages.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
