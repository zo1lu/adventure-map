import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        prata: ['Prata', 'serif'],
        yeseva_one: ['Yeseva One', 'serif'],
        noto_serif_tc: ['Noto Serif TC', 'serif'],
        noto_sans_tc: ['Noto Sans TC', 'sans-serif'],
      },
      colors:{
        'main-70':'#022c22',
        'main-50':'#115D4C',
        'main-30':'#318471',
        'main-10':'#5D9F90',
        'neutral-lighter':'#FFFFFF',
        'neutral-light':'#fdfdf4',
        'neutral-dark':'#e0e0ce',
        'error':'#EE1C1C',
        'success':'#03AE17'
      },
    },
  },
  plugins: [],
};
export default config;
