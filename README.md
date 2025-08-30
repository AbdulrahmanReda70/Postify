# ![robot](https://github.com/user-attachments/assets/9b32a962-6b4d-4b90-bfc5-0a004ee0e04f) Content Management System

A full-stack CMS built with **Laravel**, **React**, and **Tailwind CSS**, designed with scalability and clean architecture in mind.

## 📘 Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [What's Next](#whats-next)

<br>

## Getting Started

### Prerequisites

Before running this application, make sure you have the following installed:

- **Docker** and **Docker Compose**
- **Git** (for cloning the repository)
- **PHP** and **Composer** (for dependency management)

#### Platform-specific installation:

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install docker.io docker-compose make php-cli composer
sudo usermod -aG docker $USER
# Log out and log back in for group changes to take effect
```

**macOS:**

```bash
# Install Docker Desktop from https://docs.docker.com/desktop/mac/install/
# Install Homebrew if you don't have it, then:
brew install php composer
# Make is pre-installed with Xcode Command Line Tools
xcode-select --install  # if needed
```

**Windows:**

- Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
- Install [PHP](https://www.php.net/downloads) and [Composer](https://getcomposer.org/download/)
- Enable WSL 2 backend for better performance

### Installation & Setup

#### Linux & macOS (One Command Setup)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AbdulrahmanReda70/content-management-system.git
   cd content-management-system
   ```

2. **Run the complete setup:**

   ```bash
   make setup
   ```

   This single command will:

   - Copy `.env.example` to `.env` for both backend and frontend
   - Install all Composer dependencies
   - Generate Laravel application key
   - Build and start all Docker containers

3. **Access the application:**
   - **Frontend (React):** http://localhost:3000
   - **Backend (Laravel API):** http://localhost:8000

That's it! The application should be running on both Linux and macOS.

#### Windows (Manual Setup)

1. **Clone the repository:**

   ```cmd
   git clone https://github.com/AbdulrahmanReda70/content-management-system.git
   cd content-management-system
   ```

2. **Set up environment files:**

   ```cmd
   copy backend\.env.example backend\.env
   copy frontend\.env.example frontend\.env
   ```

3. **Install dependencies:**

   ```cmd
   cd backend
   composer install
   php artisan key:generate
   cd ..
   ```

4. **Start with Docker:**

   ```cmd
   docker compose up -d --build
   ```

5. **Access the application:**
   - **Frontend (React):** http://localhost:3000
   - **Backend (Laravel API):** http://localhost:8000

### Managing the Application

#### Stop the application:

```bash
docker compose down
```

#### View logs:

```bash
docker compose logs -f
```

#### Restart a specific service:

```bash
docker compose up -d --no-deps --force-recreate laravel-app
```

#### Available Make commands (Linux & macOS):

```bash
make setup              # Complete setup from scratch
make docker             # Start Docker containers only
make copy-backend-env   # Copy backend .env file
make copy-frontend-env  # Copy frontend .env file
make composer-install   # Install PHP dependencies
make key-generate       # Generate Laravel app key
```

### Docker Containers Overview

This application runs the following containers:

| Container Name | Service | Port | Purpose |
|----------------|---------|------|---------|
| `react-app` | Frontend | 3000 | React development server |
| `laravel-app` | Backend API | 8000 | Laravel PHP application |
| `mariadb` | Database | 3306 | MySQL/MariaDB database |
| `redis` | Cache | 6379 | Redis cache and sessions |

### Troubleshooting

**Missing Make on Windows:**

- Windows doesn't have `make` by default. Use the manual setup steps above.

**Port conflicts:**

- If ports 3000 or 8000 are already in use, modify them in `docker-compose.yml`

**Permission issues (Linux):**

- Ensure your user is in the docker group: `sudo usermod -aG docker $USER`
- Log out and log back in

**PHP/Composer not found (macOS):**

- Install via Homebrew: `brew install php composer`

**File upload/storage issues:**

- Storage symlink is handled automatically via Docker volume mounts
- Images are accessible at `http://localhost:8000/storage/...`

<br>

## Technologies Used

| **Frontend (React)**    | **Backend (Laravel)** |
| ----------------------- | --------------------- |
| React 18                | Laravel 11            |
| Tailwind CSS            | PHP ^8.2              |
| Redux Toolkit           | Laravel Sanctum       |
| Axios                   | Laravel Socialite     |
| React Router DOM        | Laravel Tinker        |
| Framer Motion           | Mysql                 |
| Zod (Validation)        | Laravel Debugbar      |
| React Hook Form         | Pest (Testing)        |
| Material UI (MUI)       | FakerPHP              |
| Font Awesome            | Redis                 |
| Heroicons               | Docker                |
| Emotion (CSS-in-JS)     |                       |
| React Icons             |                       |
| Testing Library (React) |                       |

<br>

## Screenshots

**Sign In**

![Screenshot from 2025-04-19 17-19-44](https://github.com/user-attachments/assets/399676be-b426-4d59-a144-9c5c7c7f4a62)

**Home Page**

![Screenshot from 2025-04-19 17-46-46](https://github.com/user-attachments/assets/bf5f5b62-d9e6-4f76-9129-5724df3bef83)

**Write Your Post**

![Screenshot from 2025-04-19 17-46-55](https://github.com/user-attachments/assets/65668ffc-970b-42d8-93c9-f5c850b07644)

**User Profile**

![Screenshot from 2025-04-19 17-47-17](https://github.com/user-attachments/assets/d04e6ff2-fb3d-4427-b4b2-7c9415179383)

**Pagination**

![d-ezgif com-optimize](https://github.com/user-attachments/assets/72017e00-fdcb-4101-b382-3513c44e9424)
