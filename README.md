# Page of Things

An interactive personal page webapp, with a custom-built wave visualisation with real-time modulation controls. Built with React and canvas animations, featuring mathematical wave synthesis, and a responsive user interface design.

## Features

- **Interactive Wave Visualisation**: Real-time oscilloscope display with mathematical wave rendering
- **Modulation**: Multiple AM/FM modulations with mouse-position control parameters
- **Mathematical Formulas**: KaTeX-rendered wave equations with tooltips
- **Optimisation**: Efficient canvas rendering with optimized mouse event handling, built for various screen sizes with modern CSS
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm package manager (this project uses pnpm)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/DayByDayBy/page_of_things.git
cd page_of_things
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm (recommended)
pnpm install
```

3. Start the development server:
```bash
# Using npm
npm start

# Using yarn
yarn start

# Using pnpm (recommended)
pnpm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Development

- `pnpm start` - Run development server with hot reloading
- `pnpm test` - Run test suite in watch mode
- `pnpm build` - Create production build
- `pnpm run predeploy` - Build and prepare for deployment (lifecycle hook, runs automatically before deploy)

### Wave Controls

- **Move your mouse** around the screen to update X and Y for the wave-maths
- **Toggle modulation layers** using the control panel
- **Real-time oscilloscope** updates showing a snapshot of the waveform
- **Hover over formulas** to see detailed mathematical expressions

## Project Structure

```
src/
├── components/
│   ├── Wavy/           # Wave visualisation components
│   └── WaveBackground.jsx
├── data/
│   └── projects.js     # Projects data
├── pages/
│   └── ProjectsPage.jsx
├── state/
│   └── modulationReducer.js
├── styles/             # CSS modules
├── utils/
│   └── waveComputation.js
└── App.jsx             # Main application component
```

## Technologies Used

- **React 18** - UI framework with hooks
- **React Router DOM** - client-side routing
- **KaTeX** - mathematical formula rendering
- **Canvas** - performant graphics rendering
- **CSS3** - simple styling with animations
- **Jest & React Testing Library** - testing framework


### Issue Reporting

- Use GitHub Issues for bug reports and feature requests
- Include detailed descriptions and reproduction steps
- Add relevant screenshots when applicable

## Testing

Run the test suite:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Generate coverage report
pnpm test --coverage
```

Test suite includes:
- Component rendering tests
- User interaction simulations
- Canvas mocking for graphics components
- Accessibility compliance tests

## Deployment

The application is configured for deployment to Vercel:

```bash
# Build for production
pnpm build

# Deploy to Vercel (if CLI is installed)
vercel --prod
```

Environment variables and build settings are configured in `vercel.json`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
