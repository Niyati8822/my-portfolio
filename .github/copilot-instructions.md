# AI Agent Instructions for React Portfolio Project

## Project Overview
This is a React-based portfolio website built with Create React App. The project uses modern React practices with React Router for navigation and SCSS for styling.

## Key Architecture Patterns
- Components are organized in `/src/components/` with each component in its own directory
- Each component directory contains:
  - `index.js` for the component code
  - `index.scss` for component-specific styles
- Assets (images, fonts) are stored in `/src/assets/`
- Main routing is handled in `App.js` using React Router v7
- Global styles are in `App.scss`

## Development Workflow
```bash
# Install dependencies
npm install

# Start development server
npm start  # Runs on http://localhost:3000

# Build for production
npm run build
```

## Project-Specific Conventions
1. **Component Structure**:
   - Each component is a default export
   - Styles are imported directly into component files
   - Component folders use PascalCase (e.g., `Layout`, `Sidebar`)

2. **Styling**:
   - SCSS modules are used for component-specific styling
   - Component styles are named `index.scss`
   - Class names use kebab-case (e.g., `nav-bar`, `logo`)

3. **Asset Management**:
   - Images are imported as modules: `import LogoS from '../../assets/images/logo-s.png'`
   - Font assets are stored in `/src/assets/fonts/`

## Dependencies
- React v19.2.0
- React Router v7.9.5
- GSAP for animations
- EmailJS for contact form functionality
- Font Awesome for icons
- Animate.css for animations
- React Leaflet for maps

## Common Tasks
1. **Adding a New Component**:
   ```
   src/components/NewComponent/
   ├── index.js
   └── index.scss
   ```

2. **Adding Routes**: Update `App.js` with new `Route` components within the `Routes` wrapper

## Testing
- Jest and React Testing Library are configured
- Run tests with `npm test`
- Test files should be co-located with components using `.test.js` extension