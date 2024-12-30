export const theme = {
  colors: {
    // Base colors
    primary: {
      light: '#38BDF8', // sky-400
      DEFAULT: '#0EA5E9', // sky-500
      dark: '#0284C7', // sky-600
    },
    background: {
      light: '#1F2937', // gray-800
      DEFAULT: '#111827', // gray-900
      dark: '#030712', // gray-950
    },
    surface: {
      light: 'rgba(31, 41, 55, 0.5)', // gray-800/50
      DEFAULT: 'rgba(17, 24, 39, 0.5)', // gray-900/50
      dark: 'rgba(3, 7, 18, 0.5)', // gray-950/50
    },
    border: {
      light: 'rgba(75, 85, 99, 0.5)', // gray-600/50
      DEFAULT: 'rgba(55, 65, 81, 0.5)', // gray-700/50
      dark: 'rgba(31, 41, 55, 0.5)', // gray-800/50
    },
    text: {
      primary: '#F9FAFB', // gray-50
      secondary: '#9CA3AF', // gray-400
      muted: '#6B7280', // gray-500
    }
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    glow: '0 0 15px rgba(56, 189, 248, 0.15)' // sky-400 glow
  },
  gradients: {
    primary: 'linear-gradient(to right, #0EA5E9, #38BDF8)', // sky-500 to sky-400
    surface: 'linear-gradient(to bottom, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.7))',
    dark: 'linear-gradient(to bottom, #111827, #030712)', // gray-900 to gray-950
    glow: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.1), transparent)' // sky-400 glow
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  transitions: {
    fast: '150ms ease-in-out',
    DEFAULT: '200ms ease-in-out',
    slow: '300ms ease-in-out'
  },
  blur: {
    sm: '4px',
    DEFAULT: '8px',
    lg: '12px'
  }
}

// Common component styles
export const componentStyles = {
  card: `
    bg-gradient-to-b from-gray-800/50 to-gray-900/70
    backdrop-blur-md
    border border-gray-700/50
    rounded-lg
    shadow-lg
  `,
  button: {
    primary: `
      bg-gradient-to-r from-sky-500 to-sky-400
      hover:from-sky-600 hover:to-sky-500
      text-white
      font-medium
      rounded-lg
      shadow-md
      hover:shadow-lg
      transition-all duration-200
    `,
    secondary: `
      bg-gradient-to-r from-gray-700/50 to-gray-600/50
      hover:from-gray-600/50 hover:to-gray-500/50
      text-gray-200
      font-medium
      rounded-lg
      shadow-md
      hover:shadow-lg
      transition-all duration-200
    `
  },
  input: `
    bg-gray-800/30
    border border-gray-700/50
    rounded-lg
    text-gray-100
    placeholder-gray-500
    focus:ring-2 focus:ring-sky-500/50
    focus:border-transparent
    transition-all duration-200
  `,
  scrollbar: `
    scrollbar-thin
    scrollbar-thumb-gray-600
    scrollbar-track-transparent
    hover:scrollbar-thumb-gray-500
  `
} 