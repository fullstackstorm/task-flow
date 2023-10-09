#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, url_for
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from datetime import datetime

# Local imports
from config import app, db, api
# Add your model imports
from models import *
# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Signup(Resource):
    def post(self):
        json = request.get_json()

        user = User(
            username=json.get('username'),
            email=json.get('email'),
        )
        user.password_hash = json.get('password')

        try:
            db.session.add(user)
            db.session.commit()
            return make_response(user.to_dict(), 201) #Problem child.
        except IntegrityError as e:
            db.session.rollback()
            return make_response({'message': 'Invalid input'}, 422)
        except Exception as e:
            db.session.rollback()
            return make_response({'message': 'An error occurred'})

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            if user:
                return make_response(user.to_dict(), 200)

        return make_response({'message': 'Could not verify authentication or could not find user.'}, 401)

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id

            response = make_response(user.to_dict(), 201)

            return response
        else:
            # Unauthorized request
            return make_response({'error': 'Authentication failed'}, 401)

    
class Logout(Resource):
    def delete(self):
        user_id = session.get('user_id')
        if user_id:
            session['user_id'] = None
            response = make_response({'message': 'Logged out successfully'}, 204)
            response.delete_cookie('user_id')
            return response
        else:
            return make_response({'error': 'Not logged in'}, 401)
        
class DeleteUser(Resource):
    def delete(self):
        # Check if a session token exists in the client-side cookie
        id = request.cookies.get('user_id')

        if id:
            user = User.query.filter_by(id=id).first()

            if user:
                # Delete the user from the database
                db.session.delete(user)
                db.session.commit()
                # Clear the session token cookie on the client side
                response = make_response({'message': 'User deleted successfully'})
                return response
            else:
                return make_response({'message': 'User not found in the database'})
        else:
            return make_response({'message': 'User not authenticated'})

        
class TaskResource(Resource):
    def get(self, task_id=None):  # Add a parameter to accept task_id
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            if task_id is not None:
                task = Task.query.filter_by(id=task_id).first()

                if task is None:
                    return make_response({"message": "Task not found"}, 404)

                # Convert the task to a dictionary
                task_dict = task.to_dict()

                # Return a JSON response
                return make_response(task_dict, 200)

            else:
                # Fetch tasks associated with the user
                tasks = Task.query.filter_by(user_id=user_id).all()

                # Convert tasks to a list of dictionaries
                tasks_dict = [task.to_dict() for task in tasks]

                # Return a JSON response
                return make_response(tasks_dict, 200)
        except Exception as e:
            return make_response({"error": str(e)}, 500)
    def put(self, task_id):
        try:
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            task = Task.query.filter_by(id=task_id).first()

            if task is None:
                return make_response({"message": "Task not found"}, 404)

            # Update the task status based on the request data
            data = request.get_json()
            if "status" in data:
                task.status = data["status"]

            db.session.commit()

            return make_response(task.to_dict(), 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
    def delete(self, task_id):
        try:
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            task = Task.query.filter_by(id=task_id).first()

            if task is None:
                return make_response({"message": "Task not found"}, 404)

            db.session.delete(task)
            db.session.commit()

            return make_response({"message": "Task deleted"}, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)  
    def post(self):
        try:
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            data = request.get_json()

            if "title" not in data or "description" not in data or "due_date" not in data:
                return make_response({"message": "Incomplete task data"}, 400)
            due_date_str = data["due_date"]
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d")

            new_task = Task(
                title=data["title"],
                description=data["description"],
                due_date=due_date,
                status=data.get("status", "PENDING"),  # Provide a default status
                project_id=data.get("project_id"),
                user_id=user_id,
            )

            db.session.add(new_task)
            db.session.commit()

            return make_response({"message": "Task created successfully", "task_id": new_task.id}, 201)

        except Exception as e:
            return make_response({"error": str(e)}, 500)     

        
class ProjectsResource(Resource):
    def get(self):
        try:
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            user = User.query.filter_by(id=user_id).first()

            project_ids = [project.id for project in user.projects]

            projects = Project.query.filter(Project.id.in_(project_ids)).all()
            projects_dict = [project.to_dict() for project in projects]

            return make_response(projects_dict, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
    def post(self):
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            json = request.get_json()

            project = Project(
                name=json.get('name'),
                description=json.get('description'),
            )

            user = User.query.filter_by(id=user_id).first()
            user.projects.append(project)

            users = json.get('users', [])

            for email in users:
                user_to_associate = User.query.filter_by(email=email).first()
                if user_to_associate:
                    project.users.append(user_to_associate)

            db.session.add(project)
            db.session.commit()

            return make_response(project.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
class TeamsResource(Resource):
    def get(self):
        try:
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)
            
            user = User.query.filter_by(id=user_id).first()

            team_ids = [team.id for team in user.teams]

            teams = Team.query.filter(Team.id.in_(team_ids)).all()
            teams_dict = [team.to_dict() for team in teams]

            return make_response(teams_dict, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
    def post(self):
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            json = request.get_json()

            team = Team(
                name=json.get('name'),
                description=json.get('description'),
            )

            user = User.query.filter_by(id=user_id).first()
            user.teams.append(team)

            users = json.get('users', [])

            for email in users:
                user_to_associate = User.query.filter_by(email=email).first()
                if user_to_associate:
                    team.users.append(user_to_associate)

            db.session.add(team)
            db.session.commit()

            return make_response(team.to_dict(), 201)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
class ProjectIndex(Resource):
    def get(self, project_id):
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            project = Project.query.filter_by(id=project_id).first()

            if project:
                return make_response(project.to_dict(), 200)
            else:
                return make_response({"message": "Project not found"}, 404)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
    def delete(self, project_id):
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            # Find the project to delete
            project = Project.query.filter_by(id=project_id).first()

            if project is None:
                return make_response({"message": "Project not found or unauthorized"}, 404)

            # Delete associated tasks
            Task.query.filter_by(project_id=project.id).delete()

            # Delete associated users (if necessary)
            for user in project.users:
                project.users.remove(user)
                db.session.commit()  # Commit the removal

            # Delete the project
            db.session.delete(project)
            db.session.commit()

            return make_response({"message": "Project deleted successfully"}, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
class TeamIndex(Resource):
    def get(self, team_id):
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            team = Team.query.filter_by(id=team_id).first()

            if team:
                return make_response(team.to_dict(), 200)
            else:
                return make_response({"message": "Team not found"}, 404)

        except Exception as e:
            return make_response({"error": str(e)}, 500)

    def delete(self, team_id):
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            # Find the team to delete
            team = Team.query.filter_by(id=team_id).first()

            if team is None:
                return make_response({"message": "Team not found or unauthorized"}, 404)

            # Delete associated users (if necessary)
            for user in team.users:
                team.users.remove(user)
                db.session.commit()  # Commit the removal

            # Delete the team
            db.session.delete(team)
            db.session.commit()

            return make_response({"message": "Team deleted successfully"}, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(DeleteUser, '/delete_user', endpoint='delete_user')
api.add_resource(TaskResource, '/tasks', '/tasks/<int:task_id>', endpoint='tasks')
api.add_resource(ProjectsResource, '/projects', endpoint='projects')
api.add_resource(TeamsResource, '/teams', endpoint='teams')
api.add_resource(ProjectIndex, '/projects/<int:project_id>', endpoint='project_index')
api.add_resource(TeamIndex, '/teams/<int:team_id>', endpoint='team_index')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

