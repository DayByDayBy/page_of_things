# Page of Things

An interactive web application featuring dynamic wave visualizations with real-time modulation controls. Built with React, this project demonstrates advanced canvas animations, mathematical wave synthesis, and responsive user interface design.

## Features

- **Interactive Wave Visualization**: Real-time oscilloscope display with mathematical wave rendering
- **Advanced Modulation**: Multiple AM/FM modulation layers with mouse-controlled parameters
- **Mathematical Formulas**: KaTeX-rendered wave equations with tooltips
- **Responsive Design**: Optimized for various screen sizes with modern CSS
- **Performance Optimized**: Efficient canvas rendering with mouse scalar computation
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm package manager

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/page_of_things.git
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
- `pnpm run predeploy` - Build and prepare for deployment

### Wave Controls

- **Move your mouse** over the wave area to modulate frequency and amplitude
- **Toggle modulation layers** using the control panel
- **View real-time oscilloscope** updates showing the resulting waveform
- **Hover over formulas** to see detailed mathematical expressions

## Project Structure

```
src/
├── components/
│   ├── Wavy/           # Wave visualization components
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
- **React Router DOM** - Client-side routing
- **KaTeX** - Mathematical formula rendering
- **Canvas API** - High-performance graphics rendering
- **CSS3** - Modern styling with animations
- **Jest & React Testing Library** - Testing framework

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with appropriate tests
4. Run tests: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use ES6+ features consistently
- Follow React best practices and hooks patterns
- Include PropTypes for component validation
- Write meaningful commit messages
- Add tests for new features

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

The test suite includes:
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

## Acknowledgments

- React team for the excellent framework
- KaTeX contributors for mathematical rendering
- Canvas API documentation and examples
- The open-source community for inspiration and tools