import React from "react";

function TaskBox({ tasks }) {
  // Sort tasks by due date, with the soonest tasks coming first
  const sortedTasks = tasks
    .filter((task) => !task.isCompleted) // Filter out completed tasks
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // Sort by due date

  // Display a maximum of six tasks or all available tasks, whichever is less
  const displayedTasks = sortedTasks.slice(0, 6);

  return (
    <div>
      <h2>My Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Due Date</th>
            <th>Completion Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedTasks.map((task, index) => (
            <tr key={index}>
              <td>{task.title}</td>
              <td>{task.dueDate}</td>
              <td>{task.isCompleted ? "Completed" : "Incomplete"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskBox;
