import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-4">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-primary">Profolio</span>
          <span>© 2025</span>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
          <a className="hover:text-primary transition-colors" href="#">Billing</a>
          <a className="hover:text-primary transition-colors" href="#">Support</a>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">Terms</a>
          <a className="hover:text-primary transition-colors" href="#">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;

