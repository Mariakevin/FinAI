
import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

// Create the sidebar context
type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Create the sidebar provider
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar, openSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Create the useSidebar hook
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// SidebarTrigger component
export function SidebarTrigger() {
  const { toggleSidebar, isOpen } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="lg:hidden"
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}

// Sidebar components
export function Sidebar({ className, children }: { className?: string; children?: React.ReactNode }) {
  const { isOpen } = useSidebar();
  
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex h-14 items-center border-b px-4", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex-1 overflow-auto py-2", className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex h-14 items-center border-t px-4", className)}>
      {children}
    </div>
  );
}

export function SidebarGroup({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("py-2", className)}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("space-y-1 px-2", className)}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("px-2 py-1.5 text-xs font-medium text-muted-foreground", className)}>
      {children}
    </div>
  );
}

export function SidebarMenu({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <nav className={cn("grid gap-1", className)}>
      {children}
    </nav>
  );
}

export function SidebarMenuItem({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function SidebarMenuButton({ 
  className, 
  children, 
  asChild = false,
  ...props 
}: { 
  className?: string; 
  children: React.ReactNode;
  asChild?: boolean;
  [key: string]: any;
}) {
  const Comp = asChild ? React.Fragment : 'button';
  const childProps = asChild ? {} : props;

  return (
    <Comp
      {...childProps}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
    >
      {children}
    </Comp>
  );
}
