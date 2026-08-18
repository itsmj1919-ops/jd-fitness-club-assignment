/**
 * Monumental Athletics: a concise multi-page architecture for a premium gym’s complete member journey.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Coaches from "./pages/Coaches";
import Membership from "./pages/Membership";
import Journal from "./pages/Journal";
import Visit from "./pages/Visit";
import NotFound from "./pages/NotFound";
import { AtlasWorldRuntime } from "./components/AtlasWorldRuntime";
import MyPractice from "./pages/MyPractice";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/programs" component={Programs} /><Route path="/coaches" component={Coaches} /><Route path="/membership" component={Membership} /><Route path="/journal" component={Journal} /><Route path="/visit" component={Visit} /><Route path="/member" component={MyPractice} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><AtlasWorldRuntime><Toaster position="bottom-right" /><Router /></AtlasWorldRuntime></TooltipProvider></ThemeProvider></ErrorBoundary>; }
