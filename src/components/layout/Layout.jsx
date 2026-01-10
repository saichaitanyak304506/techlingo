import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border bg-card py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 TechLingo - Learn Tech Vocabulary the Fun Way</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
