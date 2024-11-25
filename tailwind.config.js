/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'scale-up': 'scaleUp 300ms ease-out',
        'bounce-in': 'bounceIn 800ms ease-in-out',
        'fade-in-opacity': 'fadeInOpacity 600ms ease-out',
        'slide-in-top': 'slideInTop 600ms ease-out', 
        'slide-out-top': 'slideOutTop 700ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInOpacity: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-50%)', opacity: '0' },  
          '20%': { transform: 'translateY(-30%)', opacity: '0.3' },  
          '40%': { transform: 'translateY(-15%)', opacity: '0.6' },  
          '60%': { transform: 'translateY(-5%)', opacity: '0.8' },   
          '80%': { transform: 'translateY(2%)', opacity: '0.9' },    
          '100%': { transform: 'translateY(0)', opacity: '1' },       
        },
        slideOutTop: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '20%': { transform: 'translateY(2%)', opacity: '0.9' },
          '40%': { transform: 'translateY(-5%)', opacity: '0.8' },
          '60%': { transform: 'translateY(-15%)', opacity: '0.6' },
          '80%': { transform: 'translateY(-30%)', opacity: '0.3' },
          '100%': { transform: 'translateY(-50%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}


