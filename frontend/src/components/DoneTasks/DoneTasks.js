import React from 'react';
import Task from '../Task/Task'


const DoneTasks = ({ taskList, colorClass }) => {
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

export default DoneTasks;