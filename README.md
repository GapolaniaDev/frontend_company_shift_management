# Shift Management System - Frontend

## Project Purpose
This Angular-based frontend application serves as the user interface for a comprehensive shift management system. It allows employees to clock in/out, view their schedules, track work hours, and provides administrators with tools to manage shifts, employees, and payment periods. The application uses geolocation services to verify employee clock-in/out locations.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v18 or later)
- npm (comes with Node.js)
- Angular CLI (v18.x)
- A modern web browser with geolocation support

## Installation
Follow these steps to install and run the project locally:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shift_management_docker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   - Update the `src/environments/environment.ts` file with your backend API URL

4. Start the development server:
   ```bash
   ng serve
   ```

5. Navigate to `http://localhost:4200` in your browser

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t shift-management-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 4200:4200 shift-management-frontend
   ```

## System Usage
The application includes the following features:

- **Authentication**: User login, registration, and password reset functionality
- **Home Dashboard**: Main view showing current shift status and clock-in/out options
- **Geolocation**: Tracking of employee locations during clock-in/out operations
- **Shift Management**: View and manage employee shifts
- **Employee Management**: Add, edit, and delete employee records
- **Schedule View**: Calendar-based view of all scheduled shifts
- **Payment Periods**: Track and manage payment periods
- **Profile Management**: User profile settings and preferences
- **Dark Mode**: Toggle between light and dark themes

## Tools and Dependencies

### Core Technologies
- Angular 18.2.0
- TypeScript 5.5.2
- RxJS 7.8.0
- TailwindCSS 3.4.10

### UI Components
- Angular Google Maps
- ng-icons (Heroicons)

### Authentication
- ngx-cookie-service for token management

### Development Tools
- Angular CLI
- Karma for testing
- Jasmine for unit tests

## Future Features
Potential future enhancements include:
- Mobile application support
- Advanced reporting features
- Shift swap functionality
- Integration with payroll systems
- Push notifications for shift reminders

## Contributions
Contributions to the project are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the **MIT** License. See the [LICENSE](LICENSE) file for details.