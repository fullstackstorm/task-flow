from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import Table, Column, Integer, String, DateTime, ForeignKey, Enum, Text, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

from config import db, bcrypt

class TaskStatus(PyEnum):
    PENDING = 'pending'
    IN_PROGRESS = 'in progress'
    COMPLETED = 'completed'

TASK_STATUS = Enum(TaskStatus, name='task_status')

team_membership = Table('team_membership', db.Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('team_id', Integer, ForeignKey('teams.id'), primary_key=True)
)

project_membership = Table('project_membership', db.Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('project_id', Integer, ForeignKey('projects.id'), primary_key=True),
    PrimaryKeyConstraint('user_id', 'project_id')
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-teams.users', '-tasks.user', '-projects.users', '-comments.user',)

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    _password_hash = Column(Text)

    teams = relationship('Team', secondary=team_membership, back_populates='users')
    tasks = relationship('Task', backref='user')
    projects = relationship('Project', secondary=project_membership, back_populates='users')
    comments = relationship('Comment', backref='user')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'User {self.username}, ID: {self.id}'
    
class Task(db.Model, SerializerMixin):
    __tablename__ = 'tasks'

    serialize_only = ('id', 'title', 'description', 'due_date','status', 'project_id')

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    due_date = Column(DateTime, nullable=False)
    status = Column(TASK_STATUS) 
    user_id = Column(Integer, ForeignKey('users.id'))
    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship('Project', back_populates='tasks')

    def __repr__(self):
        return f"Task(id={self.id}, title={self.title})"

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'

    serialize_only = ('id', 'name', 'description','tasks',)

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    users = relationship('User', secondary=project_membership, back_populates='projects')
    tasks = relationship('Task', back_populates='project')



class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    serialize_rules = ('-users.comments', '-tasks.comments')

    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    task_id = Column(Integer, ForeignKey('tasks.id'))
    project_id = Column(Integer, ForeignKey('projects.id'))

class Team(db.Model, SerializerMixin):
    __tablename__ = 'teams'

    serialize_rules = ('-users.teams',)

    id = Column(Integer, primary_key=True)
    name = Column(String(20), nullable=False)
    description = Column(Text)
    users = relationship('User', secondary=team_membership, back_populates='teams')

    def __repr__(self):
        return f"Team(id={self.id}, name={self.name})"
