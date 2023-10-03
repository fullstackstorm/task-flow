#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
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

        return make_response({}, 401)

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id
            return make_response(user.to_dict(), 200)
        
        return make_response({}, 401)
    
class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return make_response({'message': 'Logged out successfully'}, 204) #Not returning message
        else:
            return make_response({'error': 'Not logged in'}, 401)
        
class DeleteUser(Resource):
    def delete(self):
        if session.get('user_id'):
            user_id = session['user_id']
            
            # Delete the user from the database
            try:
                user = User.query.get(user_id)
                if user:
                    # Remove the user from the session
                    session.pop('user_id')
                     # Delete the user from the database
                    db.session.delete(user)  
                    db.session.commit()
                    return {'message': f'Deleted user with ID {user_id}'}
                else:
                    return {'message': 'User not found in the database'}
            except IntegrityError:
                # Handle database integrity error
                return {'message': 'Failed to delete user due to database integrity error'}
        else:
            return {'message': 'User not authenticated'}

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(DeleteUser, '/delete_user', endpoint='delete_user')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

