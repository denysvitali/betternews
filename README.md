# BetterNews

A modern, fast, and beautiful Hacker News reader built with Next.js 16, TypeScript, and Tailwind CSS.

![BetterNews Logo](https://img.shields.io/badge/BetterNews-HN%20Reader-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- 🚀 **Lightning Fast** - Built with Next.js 16 and React 19 for optimal performance
- 📱 **Mobile Responsive** - Works flawlessly on desktop, tablet, and mobile devices
- 🌙 **Dark & Light Themes** - Automatic theme detection with manual toggle support
- 🔖 **Bookmarks** - Save stories to read later with local storage persistence
- 📖 **Story Details** - Read full articles and discussions with nested comment threading
- 👤 **User Profiles** - View user profiles and their submission history
- 🔄 **Pull-to-Refresh** - Mobile-friendly gesture for updating content
- 📈 **Pagination** - Efficiently browse through stories without overwhelming the UI
- 🎯 **PWA Ready** - Install as a native app on supported devices
- ♿ **Accessible** - Built with web accessibility best practices in mind

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/denysvitali/betternews.git
   cd betternews
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### Navigation
- **Home** - Browse top and latest stories from Hacker News
- **Story Details** - Click any story to read the article and comments
- **User Profiles** - Click on any username to view their profile and submissions
- **Bookmarks** - Save stories by clicking the bookmark icon

### Features
- **Theme Toggle** - Use the theme switcher in the navigation bar
- **Pull to Refresh** - On mobile devices, pull down to update the story list
- **Keyboard Navigation** - Use arrow keys to navigate stories, Enter to open

## 🛠️ Development

This project was built using a collaborative "vibe-coding" approach with [Claude Opus 4.5](https://claude.ai/) and [Gemini 3](https://gemini.google.com/), combining AI assistance with human creativity to create a modern web application.

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Project Structure

```
betternews/
├── app/                    # Next.js app directory
│   ├── story/             # Dynamic story pages
│   ├── user/              # Dynamic user profile pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── lib/                   # Utilities and hooks
│   ├── hooks.ts          # Custom React hooks
│   └── types.ts          # TypeScript type definitions
├── public/               # Static assets
└── tailwind.config.ts    # Tailwind configuration
```

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Prettier for code formatting

## 🚀 Deployment

### GitHub Pages (Recommended)

The project is pre-configured for deployment to GitHub Pages:

1. **Configure GitHub Pages** in your repository settings
2. **Enable GitHub Actions** for automatic deployment
3. **Push to main branch** to trigger automatic deployment

### Vercel (Alternative)

1. Connect your GitHub repository to [Vercel](https://vercel.com/)
2. Configure build settings (if needed)
3. Deploy automatically on every push

### Manual Deployment

```bash
# Build the application
pnpm build

# The build output will be in the `out` directory
# Upload this directory to your hosting provider
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hacker News](https://news.ycombinator.com/) for providing the API and platform
- [Y Combinator](https://www.ycombinator.com/) for the amazing community
- Built with assistance from [Claude Opus 4.5](https://claude.ai/) and [Gemini 3](https://gemini.google.com/)
- All contributors and users who help improve this project

---

**BetterNews** - A better way to read Hacker News. Built with ❤️ and AI assistance.