import React from 'react';
import './Task.css';

const Task = ({ task, colorClass }) => {

    return (
        <div className={`${colorClass} task-tag`}>
            {task.name}
        </div>
    );
};

export default Task;