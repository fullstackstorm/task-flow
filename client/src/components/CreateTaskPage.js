import React from 'react';
import TaskForm from './TaskForm'

function CreateTaskPage(){
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get('projectId');
    const userId = searchParams.get('userId');

    return (
        <div className="task-form">
            <TaskForm projectID={projectId} userID={userId} />
        </div>
    )
}

export default CreateTaskPage;