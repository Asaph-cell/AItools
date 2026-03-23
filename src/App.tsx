import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("./pages/Home"));
const Matchmaker = React.lazy(() => import("./pages/Matchmaker"));
const Directory = React.lazy(() => import("./pages/Directory"));
const Compare = React.lazy(() => import("./pages/Compare"));
const ToolDetail = React.lazy(() => import("./pages/ToolDetail"));
const BestOf = React.lazy(() => import("./pages/BestOf"));
const Trending = React.lazy(() => import("./pages/Trending"));
const NewTools = React.lazy(() => import("./pages/NewTools"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const Terms = React.lazy(() => import("./pages/Terms"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const VsPage = React.lazy(() => import("./pages/VsPage"));
const Footer = React.lazy(() => import("./components/Footer"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/matchmaker" element={<Matchmaker />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/tools/:slug" element={<ToolDetail />} />
            <Route path="/best" element={<BestOf />} />
            <Route path="/best/:category" element={<BestOf />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/new" element={<NewTools />} />
            <Route path="/vs/:slug" element={<VsPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
