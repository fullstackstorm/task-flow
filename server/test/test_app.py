import pytest
import flask
import sys
import os
import sys

# Add the parent directory (where app_module.py is located) to the Python path
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

from app import app
from models import *
from random import randint, choice as rc

app.secret_key = b'a\xdb\xd2\x13\x93\xc1\xe9\x97\xef2\xe3\x004U\xd1Z'

class TestSignup:
    '''Signup resource in app.py'''

    def test_creates_users_at_signup(self):
        '''creates user records with usernames and passwords at /signup.'''
        
        with app.app_context():
            
            User.query.delete()
            db.session.commit()
        
        with app.test_client() as client:
            
            response = client.post('/signup', json={
                'username': 'ashketchum',
                'email': 'pikachu@gmail.com',
                'password': '1likep1kachu'
            })

            assert(response.status_code == 201)

            new_user = User.query.filter(User.username == 'ashketchum').first()

            assert(new_user)
            assert(new_user.authenticate('1likep1kachu'))
            assert(new_user.email == 'pikachu@gmail.com')

    def test_422s_invalid_users_at_signup(self):
        '''422s invalid usernames at /signup.'''
        
        with app.app_context():
            
            User.query.delete()
            db.session.commit()
        
        with app.test_client() as client:
            
            response = client.post('/signup', json={
                'email': 'pikachu@gmail.com',
                'password': 'pikachu'
            })

            assert(response.status_code == 422)

class TestCheckSession:
    '''CheckSession resource in app.py'''

    def test_returns_user_json_for_active_session(self):
        '''returns JSON for the user's data if there is an active session.'''
        
        with app.app_context():
            
            User.query.delete()
            db.session.commit()
        
        with app.test_client() as client:

            # create a new first record
            client.post('/signup', json={
                'username': 'ashketchum',
                'password': 'pikachu',
            })
            
            with client.session_transaction() as session:
                
                session['user_id'] = 1

            response = client.get('/check_session')
            response_json = response.json

            assert response_json.get('id')== 1
            assert response_json.get('username')