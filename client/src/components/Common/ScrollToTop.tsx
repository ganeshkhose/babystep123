import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures page scroll is automatically reset to top on navigation.
 * Highly recommended for Single Page Apps (SPA) when navigating from footer links.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
