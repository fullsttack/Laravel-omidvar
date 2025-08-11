import React, { type ReactNode } from 'react';
import SiteHeader from '@/components/site-header';
import Footer from '@/components/footer';
import PanelSidebar from '@/components/panel-sidebar';

interface PanelLayoutProps {
    children: ReactNode;
}

export default function PanelLayout({ children }: PanelLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <SiteHeader />
            
            {/* Main Content */}
            <div className="">
                <div className="container mx-auto max-w-7xl px-4 py-6 flex gap-8 flex-row-reverse">
                   
                    
                    {/* Content Area */}
                    <main className="flex-1">
                        {children}
                    </main>

                     {/* Right Sidebar */}
                     <aside className="w-80 flex-shrink-0">
                        <PanelSidebar />
                    </aside>
                </div>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}