import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme";
import { I18nProvider } from "@/lib/i18n";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Matches from "@/pages/Matches";
import MatchDetail from "@/pages/MatchDetail";
import Teams from "@/pages/Teams";
import TeamDetail from "@/pages/TeamDetail";
import Stats from "@/pages/Stats";
import Stadiums from "@/pages/Stadiums";
import Timeline from "@/pages/Timeline";
import Simulator from "@/pages/Simulator";
import Rivality from "@/pages/Rivality";

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <div className="App">
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/matches/:id" element={<MatchDetail />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/teams/:id" element={<TeamDetail />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/stadiums" element={<Stadiums />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/simulator" element={<Simulator />} />
                <Route path="/rivality" element={<Rivality />} />
              </Routes>
            </Layout>
          </BrowserRouter>
          <Toaster />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
