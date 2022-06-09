import React, { useState, useEffect } from 'react';
import { webSocket } from 'rxjs/webSocket';
import './App.css';
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import TaskList from "../components/TaskList/TaskList";
import InProgressTasks from "../components/InProgressTasks/InProgressTasks";
import DoneTasks from '../components/DoneTasks/DoneTasks';
import Graph from '../components/Graph/Graph';

function App() {
  const [data, setData] = useState([]);
  const [taskQueue, setTaskQueue] = useState([]);
  const [inProgressTasksQueue, setInProgressTasksQueue] = useState([]);
  const [doneTasksQueue, setDoneTasksQueue] = useState([]);
  const [minEnergy, setMinEnergy] = useState(0);

  const isQueueEmpty = (queue) => {
    return queue.length === 0;
  }

  const updateMinEnergy = (newEnergy) => {
    if (newEnergy < minEnergy) {
      setMinEnergy(newEnergy);
    }
  }

  const addTask = (taskName) => {
    const task = { id: taskQueue.length + 1, name: taskName, complete: false, inProgress: false };
    taskQueue.push(task);
    setTaskQueue(taskQueue);

    return task;
  }

  const updateTaskStatus = (task, progress, complete) => {
    task.inProgress = progress;
    task.complete = complete;

    return task;
  }

  const pushTaskToInProgressQueue = (task) => {
    let copy = [...inProgressTasksQueue];
    copy.push(task);
    setInProgressTasksQueue(inProgressTasksQueue => ([...inProgressTasksQueue, ...copy]));
  }

  const pushTaskToDoneQueue = (task) => {
    let copy = [...doneTasksQueue];
    copy.push(task)
    setDoneTasksQueue(doneTasksQueue => ([...doneTasksQueue, ...copy]));
  }

  const removeFirstFromQueue = (queue) => {
    let copy = [...queue];
    copy.shift();

    return copy;
  }

  const isFrontOfQueueProcessable = () => {
    if (!isQueueEmpty(taskQueue)) {
      return taskQueue[0].complete === false && taskQueue[0].inProgress === false;
    }
    return false;
  }

  const checkTasksToProcess = () => {
    if (!isQueueEmpty(taskQueue) && isFrontOfQueueProcessable()) {
      startSession();
    }
  }

  const startSession = () => {
    const subject = webSocket('ws://localhost:8001/ws/api/');
    const updatedTask = updateTaskStatus(taskQueue[0], true, false);
    pushTaskToInProgressQueue(updatedTask);
    setData([]);

    subject.subscribe({
      next: function (new_data) {
        setData(data => [...data, new_data]);
        updateMinEnergy(new_data.energy)
      },
      complete: () => {
        setInProgressTasksQueue(removeFirstFromQueue(inProgressTasksQueue));
        const doneTask = updateTaskStatus(taskQueue[0], false, true);
        pushTaskToDoneQueue(doneTask);
        setTaskQueue(removeFirstFromQueue(taskQueue));
        taskQueue.shift();
        setTaskQueue(taskQueue);
        subject.complete();
        checkTasksToProcess();
      }
    });

    subject.next({ action: 'generate-data' });

  }

  const handleStart = () => {
    if (isQueueEmpty(taskQueue)) {
      addTask(`Task ${taskQueue.length + 1}`);
      if (!isQueueEmpty(doneTasksQueue)) {
        doneTasksQueue.length = 0;
        setDoneTasksQueue(doneTasksQueue);
      }
      startSession();
    } else {
      addTask(`Task ${taskQueue.length + 1}`);
    }
  };

  return (
    <div className="centered-div">
      <div className="flex-container-row">
        <div className="column-one">
          <div className="flex-container-column">
            <div className="item1">
              <h1 className="centered-div">Energy Graph</h1>
            </div>
            <div className="item3">
              <Graph data={data} />
            </div>
            <div className="item4 centered-div">
              <div className="flex-container-row">
                <div className="flex-container-column">
                  <div className="item1 centered-div">
                    <AwesomeButton type="primary" size="large" onPress={handleStart}>Start</AwesomeButton>
                  </div>
                  <div className="item2">
                    <div className="centered-div">
                      <h3>Min Energy: {minEnergy.toFixed(1)}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="column-two">
          <div className="flex-container-column">
            <div className="item1">
              <h3 className='underlined'>Tasks Queue</h3>
              <hr />
              <TaskList taskList={taskQueue} colorClass="task-in-queue" />
            </div>
            <div className="item2">
              <h3 className='underlined'>Tasks In Progress</h3>
              <hr />
              <InProgressTasks taskList={inProgressTasksQueue} colorClass="inprogress-task" />
            </div>
            <div className="item3">
              <h3 className='underlined'>Done Tasks</h3>
              <hr />
              <DoneTasks taskList={doneTasksQueue} colorClass="done-task" />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
