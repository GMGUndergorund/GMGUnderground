// Utility to detect if we're running in static HTML mode
// Static mode is used when the app is built as a standalone HTML site without a backend

// Check if we're in static mode by looking for a marker in the HTML
// or checking for the presence of static data files
export function isStaticMode(): boolean {
  // Check for a data-static-mode attribute in the HTML
  const htmlElement = document.documentElement;
  if (htmlElement.hasAttribute('data-static-mode')) {
    return htmlElement.getAttribute('data-static-mode') === 'true';
  }
  
  // Check for static data files by trying to fetch the games.json file
  // This is just a detection mechanism - the actual fetch will happen later
  const staticModeKey = 'gmg-underground-static-mode';
  const cachedValue = localStorage.getItem(staticModeKey);
  
  if (cachedValue !== null) {
    return cachedValue === 'true';
  }
  
  // Default to dynamic mode until we can confirm static mode
  return false;
}

// Function to detect and cache the mode
export async function detectStaticMode(): Promise<boolean> {
  const staticModeKey = 'gmg-underground-static-mode';
  
  try {
    // Try to fetch the games.json file to determine if we're in static mode
    const response = await fetch('/data/games.json');
    const isStatic = response.ok;
    
    // Cache the result
    localStorage.setItem(staticModeKey, isStatic.toString());
    return isStatic;
  } catch (error) {
    // If there's an error, we're likely in dynamic mode
    localStorage.setItem(staticModeKey, 'false');
    return false;
  }
}

// Initialize static mode detection on load
if (typeof window !== 'undefined') {
  detectStaticMode().catch(console.error);
}