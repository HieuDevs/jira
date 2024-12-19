import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "../types";
import KanbanCard from "./kanban-card";
import { KanbanColumnHeader } from "./kanban-column-header";

interface DataKanbanProps {
  data: Task[];
  onChange: (
    tasks: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[]
  ) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const inititalsTask: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      inititalsTask[task.status].push(task);
    });

    Object.keys(inititalsTask).forEach((status) => {
      inititalsTask[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });
    return inititalsTask;
  });

  useEffect(() => {
    const inititalsTask: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      inititalsTask[task.status].push(task);
    });

    Object.keys(inititalsTask).forEach((status) => {
      inititalsTask[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    setTasks(inititalsTask);
  }, [data]);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;
      const sourceStatus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatesPayload: {
        $id: string;
        status: TaskStatus;
        position: number;
      }[] = [];

      setTasks((prev) => {
        const newTasks = { ...prev };
        // Safely remove the task from the source status
        const sourceCol = [...newTasks[sourceStatus]];
        const [movedTask] = sourceCol.splice(source.index, 1);

        // If there's no task, return the previous state
        if (!movedTask) {
          console.log("No task found at the source index");
          return prev;
        }

        // Create a new task object with potentially updated status
        const updatedMovedTask =
          sourceStatus !== destinationStatus
            ? {
                ...movedTask,
                status: destinationStatus,
              }
            : movedTask;

        // Update the source column
        newTasks[sourceStatus] = sourceCol;

        // Update the destination column
        const destinationCol = [...newTasks[destinationStatus]];
        destinationCol.splice(destination.index, 0, updatedMovedTask);
        newTasks[destinationStatus] = destinationCol;

        // Prepare minimal update payloads
        updatesPayload = [];

        // Always update the position of the moved task
        updatesPayload.push({
          $id: updatedMovedTask.$id,
          status: destinationStatus,
          position: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        // Update position for affected tasks in the destination column
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (newPosition !== task.position) {
              updatesPayload.push({
                $id: task.$id,
                status: destinationStatus,
                position: newPosition,
              });
            }
          }
        });

        // If the task moved between columns, update the position of the task in the source column
        if (sourceStatus !== destinationStatus) {
          newTasks[sourceStatus].forEach((task, index) => {
            if (task && task.$id !== updatedMovedTask.$id) {
              const newPosition = Math.min((index + 1) * 1000, 1_000_000);
              if (newPosition !== task.position) {
                updatesPayload.push({
                  $id: task.$id,
                  status: sourceStatus,
                  position: newPosition,
                });
              }
            }
          });
        }
        return newTasks;
      });
      onChange(updatesPayload);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="flex-1 mx-2 bg-muted rounded-md p-1.5 min-w-[200px]"
          >
            <KanbanColumnHeader board={board} taskCount={tasks[board].length} />
            <Droppable droppableId={board}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px] py-1.5"
                >
                  {tasks[board].map((task, index) => (
                    <Draggable
                      key={task.$id}
                      draggableId={task.$id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <KanbanCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};
