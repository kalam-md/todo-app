import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TodoList from "@/components/TodoList";
import AddTask from "@/components/AddTask";
import { getAllTodos, weatherApi } from "@/api";
import { Toaster } from "@/components/ui/toaster";
import Image from 'next/image'

export default async function Home() {
  const tasks = await getAllTodos();
  const weatherData = await weatherApi("Bandung");

  return (
    <main className="flex max-w-5xl gap-7 min-h-screen mx-auto flex-col items-center justify-center p-24">
      <div className="w-full">
        <Card className="shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <CardHeader className="text-white">
            <CardTitle className="mb-2">{weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}</CardTitle>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full shadow-lg">
                <Image
                  src={`https:${weatherData.current.condition.icon}`}
                  width={64}
                  height={64}
                  alt={weatherData.current.condition.text}
                />
              </div>
              <p>{weatherData.current.condition.text} - {weatherData.current.temp_c} celcius</p>
            </div>
            
            <p>Last updated at {weatherData.current.last_updated}</p>
          </CardHeader>
        </Card>
      </div>

      <div className="w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center mb-2">ToDo List</CardTitle>
            <hr />
          </CardHeader>
          <CardContent>
            <AddTask />
          </CardContent>
        </Card>
      </div>

      <div className="w-full">
        <TodoList tasks={tasks}/>
      </div>

      <Toaster />
    </main>
  );
}
