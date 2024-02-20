"use client";

import { ITask } from "@/types/tasks";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { deleteTodo, editTodo } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"

interface TodoListProps {
  tasks: ITask[];
}

const TodoList: React.FC<TodoListProps> = ({ tasks }) => {
  const router = useRouter();
  const [completedTasks, setCompletedTasks] = useState<boolean[]>(tasks.map(task => task.complete));
  const [editStates, setEditStates] = useState<any>(tasks.map(task => task.text));

  const handleEditChange = (index: number, newText: string) => {
    const updatedEditStates = [...editStates];
    updatedEditStates[index] = newText;
    setEditStates(updatedEditStates);
  };

  const handleSubmitEditTodo = async (index: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await editTodo({
      id: tasks[index].id,
      text: editStates[index],
      complete: completedTasks[index],
    });
    router.refresh();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTodo(id);
    router.refresh();
  };

  const handleDoneTask = (index: number) => {
    const updatedTasks = [...completedTasks];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedTasks(updatedTasks);
  };

  const { toast } = useToast()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Tasks</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task, index) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">
              <Checkbox 
                checked={completedTasks[index]}
                onCheckedChange={() => handleDoneTask(index)} />
            </TableCell>

            <TableCell className={completedTasks[index] ? "font-medium line-through" : "font-medium"}>
              {task.text}
            </TableCell>
            
            <TableCell className="flex justify-end gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {/* <Button className="w-full">Create</Button> */}
                  <FiEdit className="w-5 h-5 text-slate-700 hover:text-slate-900 cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <form onSubmit={(e) => handleSubmitEditTodo(index, e)} className="flex flex-col gap-4">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Task</AlertDialogTitle>
                      <Input 
                        type="text"
                        value={editStates[index]}
                        onChange={(e) => handleEditChange(index, e.target.value)} />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          toast({
                            title: "Success",
                            description: "New task has been updated"
                          })
                        }}
                        type="submit">Update</AlertDialogAction>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogContent>
              </AlertDialog>

              <FaRegTrashAlt
                onClick={() => {
                  handleDeleteTask(task.id);
                  toast({
                      title: "Success",
                      description: "New task has been deleted"
                  });
                }}
                className="w-5 h-5 text-slate-700 hover:text-slate-900 cursor-pointer" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TodoList;