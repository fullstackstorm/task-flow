# TaskFlow - Task Management and Collaboration Platform

## General Idea

TaskFlow is a comprehensive web-based platform designed to simplify task management and foster collaboration for individuals and teams. It offers a wide range of features that include task creation, progress tracking, and more, making it suitable for personal and professional use.

## User Story

As a user, you can enjoy the following features on TaskFlow:

- Create tasks, projects, and to-do lists.
- Set deadlines for tasks and projects.
- Monitor task progress.
- Collaborate with teams and track team-related tasks.
- Boost your personal and professional productivity through effective task management.

TaskFlow aims to streamline task management, enhance team collaboration, and provide a user-friendly interface for efficiently managing your tasks and projects.

### API Routes

TaskFlow provides a robust set of API routes to support its functionality. These routes are used for user management, task and project management, team collaboration, and more:

- **Signup**: `/signup` - User registration.
- **CheckSession**: `/check_session` - Verifying user sessions.
- **Login**: `/login` - User login.
- **Logout**: `/logout` - User logout.
- **DeleteUser**: `/delete_user` - User account deletion.
- **TaskResource**: `/tasks` and `/tasks/<int:task_id>` - Managing tasks.
- **ProjectsResource**: `/projects` - Managing projects.
- **TeamsResource**: `/teams` - Managing teams.
- **ProjectIndex**: `/projects/<int:project_id>` - Accessing specific projects.
- **TeamIndex**: `/teams/<int:team_id>` - Accessing specific teams.

These API routes are the backbone of TaskFlow, enabling seamless interaction between users and the platform.

### Frontend Routes

The frontend of TaskFlow is built with user experience in mind. It provides a set of routes for various functionalities:

- `/`: The landing page - Start of the TaskFlow platform.
- `/signup`: User registration page - Register for an account.
- `/login`: User login page - Log in to your TaskFlow account.
- `/dashboard`: Dashboard page - View and manage tasks, projects, and teams.
- `/createteam`: Create Team page - Create a new team for collaboration.
- `/createproject`: Create Project page - Start a new project and manage it.
- `/project/:id`: Project Detail page - Explore and manage details of a specific project.
- `/task/:id`: Task Detail page - Dive into the details of a specific task.
- `/team/:id`: Team Detail page - Access and collaborate within a specific team.
- `/createtask`: Create Task page - Create new tasks and add them to your projects and to-do lists.

These frontend routes ensure a smooth and intuitive user experience within the TaskFlow platform.

## Getting Started

To run this web application, follow the steps below:

1. Fork and clone this repository:

    ```shell
    git clone git@github.com:<username>/task-flow.git
    ```
2. Navigate to the project directory:

    ```shell
    cd task-flow
    ``` 
3. Install the required dependencies:

    ```shell
    npm --prefix ./client install
    pipenv install
    ```
4. Open the virtual environment:

    ```shell
    npm start
    ```
5. Change into the server directory and make sure the database is up to date:
    ```shell
    cd server
    flask db upgrade
    ```
6. Seed the database:
    ```shell
    python seed.py
    ```
    Sometimes an error occurs due to the seed file struggling to keep things unique. If this happens, run the
    command again. It will eventually seed successfully.

7. Establish the flask environment and start the server:
    ```shell
    export FLASK_RUN_PORT=5555
    flask run
    ```
8. Open a new terminal and change into the client directory of the repository:

    ```shell
    cd your_path_to/task-flow/client
    ```
9. Run the front-end:

    ```shell
    npm start
    ```

TaskFlow should now be running in your web browser. Start interacting with the application and enjoy!

## Project Notes
I wouldn't consider this a complete porject. There are many things that I plan on implementing such as better css
styling, deployment, and features like inviting members via email. 

## Contributing

I will not be looking at contributions as this is a project for increasing my skills.
