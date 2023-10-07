import React from "react";

function TaskBox({ tasks }) {
  // Sort tasks by due date, with the soonest tasks coming first
  const sortedTasks = tasks
    .filter(task => task.status !== 'completed') // Filter out completed tasks
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); // Sort by due date

    console.log(sortedTasks);

  // Display a maximum of six tasks or all available tasks, whichever is less
  const displayedTasks = sortedTasks.slice(0, 6);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0];
  };

  return (
    <div>
      <h2>My Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{formatDate(task.due_date)}</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskBox;
