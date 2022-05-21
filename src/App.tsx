import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { useInterval } from "./useInterval";

const App: React.FC = () => {
  const [averageAge, setAverageAge] = useState(0);
  const [count, setCount] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  const getAverageAge = () => {
    axios.get("https://randomuser.me/api/?results=10").then((res) => {
      const usersAgeArray: number[] = [];
      res.data.results.map((user: { dob: { age: number } }) =>
        usersAgeArray.push(user.dob.age)
      );
      const sum = usersAgeArray.reduce((a: number, b: number) => a + b, 0);
      const averageAge = sum / usersAgeArray.length;
      setAverageAge(averageAge);
    });
  };

  useEffect(() => {
    getAverageAge();
  }, []);

  useInterval(
    () => {
      if (count > 0) {
        setCount(count - 1);
      } else {
        getAverageAge();
        setCount(10);
      }
    },
    isRunning ? 1000 : null
  );

  return (
    <div className="App" style={{ paddingTop: "50px" }}>
      <h2>Average age of users: {averageAge}</h2>
      <button
        onClick={() => setIsRunning(!isRunning)}
        style={{ padding: "10px 20px" }}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      {!isRunning && <p>Time to next refresh: {count}s</p>}
    </div>
  );
};

export default App;
