import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import LoanTracker from "./pages/LoanTracker";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import LiveChat from "./components/LiveChat";
import ReferralProgram from "./pages/ReferralProgram";
import DocumentVerification from "./pages/DocumentVerification";
import CustomerDashboard from "./pages/CustomerDashboard";
import PaymentPage from "./pages/PaymentPage";
import AdminAnalytics from "./pages/AdminAnalytics";
import Support from "./pages/Support";
import Marketplace from "./pages/Marketplace";
import Tokenization from "./pages/Tokenization";
import UserRegistration from "./pages/UserRegistration";
import UserManagement from "./pages/UserManagement";
import LoginPage from "./pages/LoginPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path={"/track"} component={LoanTracker} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/referral"} component={ReferralProgram} />
      <Route path={"/documents"} component={DocumentVerification} />
      <Route path={"/dashboard"} component={CustomerDashboard} />
      <Route path={"/payment"} component={PaymentPage} />
      <Route path="/analytics" component={AdminAnalytics} />
      <Route path="/users" component={UserManagement} />
      <Route path="/support" component={Support} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path="/tokenization" component={Tokenization} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={UserRegistration} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <LiveChat />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
