import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { AxisProvider } from "@/context/AxisContext";

const queryClient = new QueryClient();

// Lazy load heavy components
const ContextBar = Suspense.lazy(() => import("@/components/ContextBar").then(m => ({ default: m.ContextBar })));
const Sidebar = Suspense.lazy(() => import("@/components/Sidebar").then(m => ({ default: m.Sidebar })));
const TooltipProvider = Suspense.lazy(() => import("@/components/ui/tooltip").then(m => ({ default: m.TooltipProvider })));
const Toaster = Suspense.lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = Suspense.lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster as any })));

const Index = Suspense.lazy(() => import("./pages/Index.tsx"));
const EmployeesPage = Suspense.lazy(() => import("./pages/EmployeesPage.tsx").then(m => ({ default: m.EmployeesPage })));
const PayrollPage = Suspense.lazy(() => import("./pages/PayrollPage.tsx").then(m => ({ default: m.PayrollPage })));
const TimesheetPage = Suspense.lazy(() => import("./pages/TimesheetPage.tsx").then(m => ({ default: m.TimesheetPage })));
const NotFound = Suspense.lazy(() => import("./pages/NotFound.tsx"));

function LoadingFallback() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-700">Loading AXIS...</p>
      </div>
    </div>
  );
}

const App = () => {
  console.log('🚀 App rendering...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AxisProvider>
          <Suspense fallback={<LoadingFallback />}>
            <div className="flex flex-col h-screen overflow-hidden bg-background">
              {/* Top bar */}
              <Suspense fallback={<div className="h-16 bg-gray-200" />}>
                <ContextBar />
              </Suspense>
              {/* Body */}
              <div className="flex flex-1 min-h-0">
                <Suspense fallback={<div className="w-64 bg-gray-200" />}>
                  <Sidebar />
                </Suspense>
                <main className="flex-1 min-w-0 overflow-hidden">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/employees" element={<EmployeesPage />} />
                      <Route path="/payroll" element={<PayrollPage />} />
                      <Route path="/timesheet" element={<TimesheetPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </div>
          </Suspense>
        </AxisProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
