import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "wouter";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Balance from "./pages/Balance";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Card from "./pages/Card";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTransactions from "./pages/admin/AdminTransactions";
import NotFound from "./pages/not-found";

function RootRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/home");
  }, [setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/home" component={Home} />
      <Route path="/features" component={Features} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/balance" component={Balance} />
      <Route path="/transfer" component={Transfer} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/profile" component={Profile} />
      <Route path="/card" component={Card} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/transactions" component={AdminTransactions} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster position="top-right" theme="dark" richColors />
    </AuthProvider>
  );
}

export default App;
