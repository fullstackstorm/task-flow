#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, url_for
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

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
    def get(self):
        try:
            # Retrieve user_id from the session or authentication token
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            # Fetch tasks associated with the user
            tasks = Task.query.filter_by(user_id=user_id).all()

            # Convert tasks to a list of dictionaries
            tasks_dict = [task.to_dict() for task in tasks]

            # Return a JSON response
            return make_response(tasks_dict, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        
class ProjectsResource(Resource):
    def get(self):
        try:
            user_id = session.get("user_id")

            if user_id is None:
                return make_response({"message": "Authentication required"}, 401)

            projects = Project.query.filter(Project.users.any(id=user_id)).all()

            projects_dict = [project.to_dict() for project in projects]

            return make_response(projects_dict, 200)

        except Exception as e:
            return make_response({"error": str(e)}, 500)
        


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(DeleteUser, '/delete_user', endpoint='delete_user')
api.add_resource(TaskResource, '/tasks', endpoint='tasks')
api.add_resource(ProjectsResource, '/projects', endpoint='projects')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

