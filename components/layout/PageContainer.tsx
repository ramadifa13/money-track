import { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <section className="p-4 sm:p-6 md:p-8 max-w-screen-xl mx-auto">
      {children}
    </section>
  );
}
