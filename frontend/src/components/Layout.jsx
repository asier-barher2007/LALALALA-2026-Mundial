import React from "react";
import Header from "@/components/Header";

const Footer = () => (
  <footer className="border-t border-white/10 mt-24 py-8 section-pad" data-testid="site-footer">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-zinc-500">
      <div className="font-display tracking-widest uppercase">
        WORLDCUP NEXUS <span className="text-neon">— 2026</span>
      </div>
      <div className="font-mono">Datos en tiempo real · Powered by Claude AI · v1.0</div>
    </div>
  </footer>
);

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
