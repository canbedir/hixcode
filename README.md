<div align="center">

# hixCode

**Showcase your GitHub projects — beautifully.**

hixCode is an open-source portfolio platform that lets developers present their GitHub repositories in a clean, structured, and visually appealing way. No more sending recruiters to a raw GitHub profile — give your work the presentation it deserves.

[**Live Demo →**](https://hixcode.vercel.app)

</div>

---

## What is hixCode?

GitHub profiles are great for collaborating — but they're not built for showcasing. hixCode bridges that gap by pulling your repositories via the GitHub API and presenting them as a polished, browsable portfolio.

Whether you're a junior developer applying for your first job or an open-source maintainer wanting more visibility, hixCode gives your projects a proper stage.

## Features

- **GitHub API integration** — automatically syncs your repositories
- **Clean portfolio UI** — projects displayed in a modern, structured layout
- **Tech stack tagging** — highlights languages and tools used in each project
- **Fast & responsive** — built with Next.js 14 and deployed on Vercel
- **Open source** — fork it, customize it, make it yours

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Prisma |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A GitHub account (for API access)

### Installation

```bash
# Clone the repository
git clone https://github.com/canbedir/hixcode.git
cd hixcode

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your GitHub API token and database URL

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

```env
GITHUB_TOKEN=your_github_personal_access_token
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Roadmap

- [ ] AI-powered project summaries from README and commit history
- [ ] Smart tagging and auto-categorization of repositories
- [ ] Custom themes and layout options
- [ ] Analytics dashboard (views, clicks per project)
- [ ] Public profile sharing with custom URLs

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
Built by <a href="https://github.com/canbedir">canbedir</a> · <a href="https://hixcode.vercel.app">hixcode.vercel.app</a>
</div>
