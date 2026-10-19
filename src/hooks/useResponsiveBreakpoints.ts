import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveState {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

/**
 * Custom hook to detect viewport breakpoints and adapt layout
 * - Mobile: < 768px (Sidebar operates as a drawer: 80-88vw, max 360px)
 * - Tablet: 768px - 1023px (Sidebar automatically collapsed into compact icon mode)
 * - Desktop: >= 1024px (Sidebar persistent: 260px - 280px)
 */
export function useResponsiveBreakpoints(onBreakpointChange?: (breakpoint: Breakpoint) => void): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    const breakpoint: Breakpoint = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

    return {
      breakpoint,
      isMobile,
      isTablet,
      isDesktop,
      width,
      height
    };
  });

  useEffect(() => {
    let prevBreakpoint = state.breakpoint;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const breakpoint: Breakpoint = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

      setState({
        breakpoint,
        isMobile,
        isTablet,
        isDesktop,
        width,
        height
      });

      if (breakpoint !== prevBreakpoint) {
        prevBreakpoint = breakpoint;
        onBreakpointChange?.(breakpoint);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [onBreakpointChange]);

  return state;
}
