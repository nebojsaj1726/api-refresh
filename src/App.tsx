import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [avgAge, setAvgAge] = useState<number>();
  const [paused, setPaused] = useState<boolean>(false);

  const getAvgAge = async () => {
    try {
      const apiUsers = await axios.get("https://randomuser.me/api/?results=10");

      const usersAgeArray: number[] = [];

      apiUsers.data.results.map((user: { dob: { age: number } }) =>
        usersAgeArray.push(user.dob.age)
      );

      const sum = usersAgeArray.reduce((a: number, b: number) => a + b, 0);
      const averageAge = sum / usersAgeArray.length;

      setAvgAge(averageAge);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAvgAge();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) {
        clearInterval(interval);
        return;
      }
      getAvgAge();
    }, 10000);

    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="App">
      <h3>Prosecna starost korisnika: {avgAge}</h3>
      <button onClick={() => setPaused(!paused)}>
        {paused ? "Start" : "Stop"}
      </button>
    </div>
  );
};

export default App;
