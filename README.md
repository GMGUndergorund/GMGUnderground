# GMG Underground - Game Download Portal

GMG Underground is a platform for game enthusiasts to browse and download games. The site features an admin interface for managing game content and a public interface for users to discover and download games.

## Features

- **User Features**
  - Browse games with filtering by category and search
  - View detailed game information
  - Download games
  - Responsive design for mobile and desktop

- **Admin Features**
  - Password-protected admin area (Password: GMG1707.3)
  - Add, edit, and delete games
  - Mark games as featured
  - Manage game categories and tags
  - Upload game cover images

## Technology Stack

- **Frontend**: React, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Simple password protection for admin

## Deployment Options

### Option 1: Deploy as Static HTML (Simplest)

For the simplest deployment without needing a database or server:

1. Run the static HTML build script: `./static-html-build.sh`
2. Upload the generated files from `client/dist/` to any web hosting service
3. Alternatively, use the generated ZIP file at `export/gmg-underground-static-html.zip`

The static HTML version:
- Works on any web hosting service (GitHub Pages, Netlify, Vercel, etc.)
- Doesn't require Node.js or PostgreSQL
- Uses local JSON files for data
- Has limited admin functionality (changes won't persist)

### Option 2: Deploy on Render (Full Version)

This project includes configuration for easy deployment on Render:

1. Sign up at [render.com](https://render.com)
2. Create a new "Blueprint" deployment
3. Connect your GitHub/GitLab repository
4. Render will detect the `render.yaml` file and create the necessary services
5. The database will be automatically provisioned

See the detailed instructions in `export/render-instructions/README.md`.

### Option 3: Deploy on Other Platforms (Full Version)

1. Set up a PostgreSQL database
2. Run the build script: `./build.sh`
3. Configure environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - Set to `production`
   - `PORT` - The port for your web server (default: 5000)
4. Start the server with `npm start`

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a PostgreSQL database and set the `DATABASE_URL` environment variable
4. Run migrations: `npm run db:push`
5. Start the development server: `npm run dev`

## Project Structure

- `/client` - React frontend
- `/server` - Express backend
- `/shared` - Shared TypeScript types and schemas
- `/public` - Static assets

## License

This project is licensed under the MIT License.