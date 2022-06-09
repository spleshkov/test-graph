import React from 'react';
import Task from '../Task/Task'


const InProgressTasks = ({ taskList, colorClass }) => {
    return (
        <div>
            {taskList.map(task => {
                return (
                    <Task task={task} colorClass={colorClass} />
                )
            })}
        </div>
    );
};

export default InProgressTasks;