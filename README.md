# Sponsorship Manager

A modern web application for content creators to manage their YouTube sponsorship deals using a Kanban board interface.

## Features

- **Modern Kanban Board**: 9-stage pipeline to track sponsorship deals from pitch to completion
- **Comprehensive Deal Management**: Track brand details, contact information, deliverables, and timeline
- **Creator Dashboard**: View profile, subscriber count, and deal pipeline metrics
- **Add New Deal Modal**: Streamlined form to create new sponsorship opportunities
- **Deal Details View**: Full sponsorship details with status management
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Next.js 14**: Latest stable version with App Router
- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn UI**: High-quality React components
- **Radix UI**: Accessible component primitives

## Getting Started

### Prerequisites

- Node.js 18+ (LTS)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
cd copilot-sponsorship
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
copilot-sponsorship/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard page
│   │   ├── login/            # Login page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── dashboard/        # Dashboard components
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── AddDealModal.tsx
│   │   │   └── DealDetailsModal.tsx
│   │   └── ui/               # Shadcn UI components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Pages

### Landing Page (`/`)
- Hero section with application overview
- Feature highlights
- Call-to-action buttons

### Login Page (`/login`)
- Email and password authentication
- Error handling
- Redirect to dashboard on successful login

### Dashboard (`/dashboard`)
- Creator profile section
- Search and filter functionality
- Kanban board with 9 status columns
- Add new deal button

## Components

### Shadcn UI Components Used

- **Button** - Primary actions and CTAs
- **Card** - Sponsorship deal cards
- **Input** - Form inputs
- **Label** - Form labels
- **Textarea** - Multi-line text areas
- **Badge** - Status and priority indicators
- **Avatar** - Creator profile images
- **Select** - Dropdown selections
- **DropdownMenu** - Context menus
- **Dialog** - Modals for details and creation
- **Alert** - Error messages
- **Typography** - Text hierarchy

## Sponsorship Status Pipeline

1. **Pitch Received** - Initial pitch from brand
2. **Under Review** - Reviewing the opportunity
3. **Negotiating** - Actively negotiating terms
4. **Approved** - Deal terms approved
5. **Contracted** - Contract signed
6. **Content Creation** - Creating content
7. **Awaiting Review** - Awaiting brand approval
8. **Published** - Content published
9. **Completed/Archived** - Deal completed

## Key Features

### Kanban Board
- Visual pipeline for tracking deals
- Drag-and-drop support (ready for implementation)
- Card count badges per column
- Quick actions menu

### Deal Management
- Create new deals with comprehensive details
- View full deal information
- Update deal status
- Edit and delete deals
- Attachments support

### Dashboard Statistics
- Active deals count
- Pending approvals
- Completed deals
- Total pipeline value

## Development

### Build for production:
```bash
npm run build
npm start
```

### Type checking:
```bash
npm run type-check
```

### Linting:
```bash
npm run lint
```

## Future Enhancements

- Drag-and-drop Kanban board functionality
- Database integration (PostgreSQL/MongoDB)
- Authentication system (NextAuth.js)
- Email notifications
- Analytics and reporting
- Team collaboration features
- Contract management
- Payment integration

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes

## Support

For issues or feature requests, please open an issue on GitHub.
