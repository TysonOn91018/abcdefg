import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// Relative assets work at both / and GitHub Pages repository subpaths.
export default defineConfig({plugins:[react()],base:'./'});
