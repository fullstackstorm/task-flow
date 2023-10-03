#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from sqlalchemy import delete

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import *

fake = Faker()

def clear_existing_data():
    delete_statement = delete(project_membership)
    db.session.execute(delete_statement)
    delete_statement = delete(team_membership)
    db.session.execute(delete_statement)
    User.query.delete()
    Team.query.delete()
    Project.query.delete()
    Task.query.delete()
    Comment.query.delete()
    db.session.commit()

def create_fake_users(num_users):
    for _ in range(num_users):
        user = User(
            username=fake.user_name(),
            email=fake.email()
        )
        user.password_hash = fake.password() + 'wrgekhj39479YUIRjikuhw89874325'
        db.session.add(user)

def create_fake_teams(num_teams, users):
    for _ in range(num_teams):
        team = Team(
            name=fake.word(),
            description=fake.text(),
        )
        # Assign random users to the team
        random_users = fake.random_elements(
                elements=users, 
                length=fake.random_int(1, len(users)/2)
            )
        for user in random_users:
            if user not in team.users:
                team.users.append(user)

        db.session.add(team)

def create_fake_projects(num_projects, users):
    for _ in range(num_projects):
        project = Project(
            name=fake.catch_phrase(),
            description=fake.text(),
        )
        # Assign random users to the project
        random_users = fake.random_elements(elements=users, unique=True, length=fake.random_int(1, len(users) // 2))
        project.users.extend(random_users)

        db.session.add(project)

def create_fake_tasks(num_tasks, users, projects):
    for _ in range(num_tasks):
        task = Task(
            title=fake.sentence(),
            description=fake.text(),
            due_date=fake.date_time_this_decade(),
            status=fake.random_element(
                elements=[TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED]
            ),
        )
        # Assign a random user and project by their IDs
        task.user_id = fake.random_element(elements=[user.id for user in users])
        task.project_id = fake.random_element(elements=[project.id for project in projects])
        db.session.add(task)

def create_fake_comments(num_comments, users, tasks, projects):
    for _ in range(num_comments):
        comment = Comment(
            text=fake.text(),
        )
        # Assign a random user, task, and project by their IDs
        comment.user_id = fake.random_element(elements=[user.id for user in users])
        comment.task_id = fake.random_element(elements=[task.id for task in tasks])
        comment.project_id = fake.random_element(elements=[project.id for project in projects])
        db.session.add(comment)

def seed_database():
    print("Deleting existing data. . .")
    clear_existing_data()
    
    num_users = 10
    num_teams = 5
    num_projects = 20
    num_tasks = 50
    num_comments = 100
    
    print("Creating users. . .")
    create_fake_users(num_users)
    users = User.query.all()

    print("Creating teams. . .")
    create_fake_teams(num_teams, users)
    
    print("Creating projects. . .")
    create_fake_projects(num_projects, users)
    
    projects = Project.query.all()
    
    print("Creating tasks. . .")
    create_fake_tasks(num_tasks, users, projects)
    tasks = Task.query.all()

    print("Creating comments. . .")
    create_fake_comments(num_comments, users, tasks, projects)
    
    db.session.commit()
    print("Complete.")

if __name__ == '__main__':
    seed_database()
