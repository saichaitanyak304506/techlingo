import React from "react";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4 animate-pulse">
            <span className="text-2xl font-bold">TL</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        {isAuthenticated ? <Dashboard /> : <Landing />}
      </div>
    </main>
  );
};

export default Index;
