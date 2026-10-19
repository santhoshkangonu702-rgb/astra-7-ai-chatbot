/**
 * Tactile Haptic Engine for ASTRA 7 — NEXUS 2040
 * Gracefully wraps the HTML5 Vibration API (navigator.vibrate)
 * to provide futuristic, tactile responses on mobile and supported devices.
 */

export const triggerHaptic = (pattern: number | number[] = 15): boolean => {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      return navigator.vibrate(pattern);
    } catch {
      // Ignored if user hasn't interacted or if device permissions block vibration
      return false;
    }
  }
  return false;
};

/**
 * Rhythmic cybernetic quantum pulse for touching the central ASTRA Core
 * Pattern: short buzz, pause, deeper resonance
 */
export const hapticCorePulse = () => {
  triggerHaptic([18, 32, 26]);
};

/**
 * Light crisp click for primary and secondary navigation tabs
 */
export const hapticNavClick = () => {
  triggerHaptic(14);
};

/**
 * Tactile feedback for workspace power transitions and full-screen swaps
 */
export const hapticWorkspaceTransition = () => {
  triggerHaptic([10, 35, 16]);
};

/**
 * Medium pulse for primary action triggers (e.g. "ASK ASTRA 7", Voice Mode, Search)
 */
export const hapticAction = () => {
  triggerHaptic(28);
};

/**
 * Quick dual-click for mode toggle (Present vs Future 2040)
 */
export const hapticModeSwitch = () => {
  triggerHaptic([12, 25, 12]);
};

/**
 * Success / resolution pattern for Brain Routing completion or query dispatch
 */
export const hapticSuccess = () => {
  triggerHaptic([20, 45, 30]);
};

/**
 * Subtle feedback for drawer open/close or modal toggles
 */
export const hapticDrawer = () => {
  triggerHaptic(20);
};
