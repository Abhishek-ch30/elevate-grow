import { ReactNode } from "react";
import { TubelightNavbar } from "./TubelightNavbar";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col page-gradient">
      <TubelightNavbar />
      <main className="pt-14 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
