import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [avgAge, setAvgAge] = useState<number>();
  const [paused, setPaused] = useState<boolean>(false);

  const defaultTime: number = 10000;
  let startTime: any = useRef(Date.now());
  let timeDifference: any = useRef(defaultTime);
  let timerId: any = useRef();

  const getAvgAge = () => {
    axios.get("https://randomuser.me/api/?results=10").then((res) => {
      const usersAgeArray: number[] = [];

      res.data.results.map((user: { dob: { age: number } }) =>
        usersAgeArray.push(user.dob.age)
      );

      const sum = usersAgeArray.reduce((a: number, b: number) => a + b, 0);
      const averageAge = sum / usersAgeArray.length;

      setAvgAge(averageAge);
    });
  };

  useEffect(() => {
    getAvgAge();
  }, []);

  useEffect(() => {
    if (!paused) {
      startTime.current = Date.now(); // set start time used to calculate difference between "Start"/"Stop" clicks

      timerId.current = setInterval(() => {
        timeDifference.current = defaultTime; // reset timer to default value 10000msec when API call is successfull
        getAvgAge();
      }, timeDifference.current);
    }

    if (paused) {
      clearInterval(timerId.current);

      if (timeDifference.current === defaultTime) {
        timeDifference.current = defaultTime - (Date.now() - startTime.current);
        // first click on "Stop" button calculates time diff with default time 10000msec
      } else {
        timeDifference.current =
          timeDifference.current - (Date.now() - startTime.current);
        // ... others calculated with previous time diff value, for multiple rapid clicks on "Start"/"Stop" button
      }
    }

    return () => clearInterval(timerId.current);
  }, [paused, avgAge]);

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
