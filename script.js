import {  API_KEY } from "./secrectKey.js";

function openFeature() {
  let allWork = document.querySelectorAll(".elem");
  let workSpace = document.querySelectorAll(".fullElem");
  let workSpaceBack = document.querySelectorAll(".fullElem .back");
  allWork.forEach((work) => {
    work.addEventListener("click", () => {
      workSpace[work.id].style.display = "block";
    });
  });

  workSpaceBack.forEach((back) => {
    back.addEventListener("click", () => {
      workSpace[back.id].style.display = "none";
    });
  });
}
openFeature();

function TodoList() {
  let form = document.querySelector(".add-task form");
  let Inputvalue = document.querySelector(".add-task #todoForm  #task-input");
  let TaskDetails = document.querySelector(".add-task #todoForm  #detail");
  let checkBox = document.querySelector(" #todoForm .mark-imp #checkbox ");

  let allTaskList = [];

  if (localStorage.getItem("task")) {
    allTaskList = JSON.parse(localStorage.getItem("task"));
  } else {
    console.log("Empty task");
  }

  function addtask() {
    let taksList = document.querySelector(".task-list");
    let add = "";
    allTaskList.forEach((elem, idx) => {
      add += `<div class="task">
                   <h5>${elem.task} <span class=${elem.imp}>imp</span> </h5>
                   <button id=${idx} class='complete-btn' >Mark as Completed</button>
              </div>`;
    });
    taksList.innerHTML = add;
    localStorage.setItem("task", JSON.stringify(allTaskList));
    document.querySelectorAll(".task .complete-btn").forEach((elem) => {
      elem.addEventListener("click", () => {
        allTaskList.splice(elem.id, 1);
        addtask();
      });
    });
  }
  addtask();

  form.addEventListener("submit", (dets) => {
    dets.preventDefault();

    let newtask = {
      task: Inputvalue.value,
      detail: TaskDetails.value,
      imp: checkBox.checked,
    };
    allTaskList.push(newtask);
    addtask();
    Inputvalue.value = "";
    TaskDetails.value = "";
    checkBox.checked = false;
  });
}
TodoList();

function dailyPlanner() {
  let hours = Array.from({ length: 18 }, (elem, idx) => {
    return 6 + idx;
  });

  let dailyplantime = document.querySelector(".daily_planTime");
  let input = "";
  hours.forEach((elem) => {
    input += `<div class="dayPlanner">
  <p>${elem}:00-${elem + 1}:00</p>
  <input type="text" placeholder="...">
  </div>`;
  });

  dailyplantime.innerHTML = input;

  let dayPlannerData = JSON.parse(localStorage.getItem("dailywork")) || [];
  let dayPlannerinput = document.querySelectorAll(".dayPlanner input");
  const todaytime = new Date().toISOString().split("T")[0];

  if (
    dayPlannerData.length > 0 &&
    dayPlannerData[0] &&
    dayPlannerData[0].date !== todaytime
  ) {
    dayPlannerData = [];
    localStorage.setItem("dailywork", JSON.stringify(dayPlannerData));
  }

  dayPlannerinput.forEach((elem, idx) => {
    elem.value = dayPlannerData[idx]?.inputval || "";
    elem.addEventListener("change", () => {
      let inputdata = {
        inputval: elem.value,
        date: todaytime,
      };
      dayPlannerData[idx] = inputdata;
      localStorage.setItem("dailywork", JSON.stringify(dayPlannerData));
    });
  });
}

dailyPlanner();

function Motivationalpage() {
  let motivationalquotes = document.querySelector(".motivations .Quotes p");
  let author = document.querySelector(".motivations .author p");
  async function fetchmotivation() {
    const response = await fetch(
      "https://farzi-vichar-api.vercel.app/language/hindi/random",
    );
    const data = await response.json();
    motivationalquotes.innerHTML = data.content;
    author.innerHTML = "_" + data.category;
  }

  fetchmotivation();
}

Motivationalpage();

function PomoDoroTimer() {
  let pomotimer = document.querySelector(".pomo-timer h2");
  let totalTime = 25 * 60;
  let timeInterval = null;
  let workSession = true;

  function timer() {
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    pomotimer.innerHTML = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  let pausebtn = document.querySelector(".pause");
  let startbtn = document.querySelector(".start");
  let resetbtn = document.querySelector(".reset");
  let session = document.querySelector(".session");
  let heading = document.querySelector(".pomodoro-timer-fullPage h1");

  function pause() {
    clearInterval(timeInterval);
  }

  function start() {
    clearInterval(timeInterval);
    if (workSession) {
      timeInterval = setInterval(() => {
        totalTime--;
        if (totalTime <= 0) {
          clearInterval(timeInterval);
          workSession = false;
          pomotimer.innerHTML = "5:00";
          totalTime = 5 * 60;
          session.innerHTML = "Take a break";
          session.style.backgroundColor = "var(--break)";
          heading.innerHTML = "Recharge Mode";
          heading.style.color = "#C7D2B8";
        }
        timer();
      }, 1000);
    } else {
      timeInterval = setInterval(() => {
        totalTime--;
        if (totalTime <= 0) {
          clearInterval(timeInterval);
          workSession = true;
          pomotimer.innerHTML = "25:00";
          totalTime = 25 * 60;
          session.innerHTML = "Work Session";
          session.style.backgroundColor = "var(--work)";
          heading.innerHTML = "Focus Mode";
          heading.style.color = "#F5E6D3";
        }
        timer();
      }, 1000);
    }
  }

  function reset() {
    if (workSession) {
      totalTime = 25 * 60;
    } else {
      totalTime = 5 * 60;
    }
    clearInterval(timeInterval);
    timer();
  }

  pausebtn.addEventListener("click", pause);
  startbtn.addEventListener("click", start);
  resetbtn.addEventListener("click", reset);
}

PomoDoroTimer();

function frontUI() {
  let city = "Ranchi";
  let temp = document.querySelector(".header2 h1");
  let weathercondition = document.querySelector(".header2 h2");
  let pressure = document.querySelector(".header2 .pressure");
  let humidity = document.querySelector(".header2 .humidity");
  let wind = document.querySelector(".header2 .wind");
  let dateYear = document.querySelector(".header1 h1");
  let dayTime = document.querySelector(".header1 h2");
  let wallpaper = document.querySelector(".allElems header");
  let header1 = document.querySelector(".header1");
  let header2 = document.querySelector(".header2");

  async function weather() {
    let data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
    );
    let response = await data.json();
    temp.innerHTML = response.main.temp;
    humidity.innerHTML = `Humidity: ${response.main.humidity} %`;
    wind.innerHTML = `Wind: ${response.wind.speed} km/h`;
    weathercondition.innerHTML = response.weather[0].description;
    pressure.innerHTML = `Pressure: ${response.main.pressure} pascal `;
  }
  weather();

  function timeDate() {
    let totalWeekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const totalyearMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let data = new Date();
    let month = totalyearMonths[data.getMonth()];
    let year = data.getFullYear();
    let date = data.getDate();
    let day = totalWeekDays[data.getDay()];
    let hour = data.getHours();
    let minute = data.getMinutes();
    hour = String(hour).padStart(2, "0");
    minute = String(minute).padStart(2, "0");
    let ampm = hour >= 12 ? "PM" : "AM";
    dateYear.innerHTML = `${date} ${month},${year}`;
    if (hour > 12) {
      dayTime.innerHTML = `${day}, ${hour - 12}:${minute} ${ampm}`;
    } else {
      dayTime.innerHTML = `${day}, ${hour}:${minute} ${ampm}`;
    }

    if (hour >= 6 && hour < 12) {
      wallpaper.style.backgroundImage =
        "url('https://images.unsplash.com/photo-1748415695958-307f1cfd159d?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    } else if (hour >= 12 && hour < 16) {
      wallpaper.style.backgroundImage =
        "url('https://images.unsplash.com/photo-1600262912274-28f333fa17bd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
    } else if (hour >= 16 && hour < 20) {
      wallpaper.style.backgroundImage =
        "url('https://static.vecteezy.com/system/resources/previews/053/247/637/non_2x/background-clouds-against-the-blue-sky-and-sun-background-of-nature-free-photo.jpg')";
    } else {
      wallpaper.style.backgroundImage =
        "url('https://static.vecteezy.com/system/resources/previews/027/905/741/non_2x/night-sky-a-dark-landscape-with-mountains-stars-shining-brightly-generated-by-ai-free-photo.jpg')";

      header1.style.color = "#BFC9D1";
      header2.style.color = "#BFC9D1";
    }
  }
  timeDate();
}

frontUI();

function DailyGoals() {
  function dailyGoals() {
    const goalInput = document.getElementById("goalInput");
    const addBtn = document.getElementById("addGoal");
    const goalList = document.querySelector(".goalList");

    let goals = JSON.parse(localStorage.getItem("dailyGoals")) || [];

    function renderGoals() {
      goalList.innerHTML = "";

      goals.forEach((goal, index) => {
        const div = document.createElement("div");
        div.className = "goalItem";
        if (goal.completed) div.classList.add("completed");

        div.innerHTML = `
        <span>${goal.text}</span>
        <div class="goalActions">
          <button class="completeBtn">✔</button>
          <button class="deleteBtn">❌</button>
        </div>
      `;

        // Complete Toggle
        div.querySelector(".completeBtn").addEventListener("click", () => {
          goals[index].completed = !goals[index].completed;
          localStorage.setItem("dailyGoals", JSON.stringify(goals));
          renderGoals();
        });

        // Delete
        div.querySelector(".deleteBtn").addEventListener("click", () => {
          goals.splice(index, 1);
          localStorage.setItem("dailyGoals", JSON.stringify(goals));
          renderGoals();
        });

        goalList.appendChild(div);
      });
    }

    // Add Goal
    addBtn.addEventListener("click", () => {
      if (goalInput.value.trim() === "") return;

      goals.push({
        text: goalInput.value,
        completed: false,
      });

      localStorage.setItem("dailyGoals", JSON.stringify(goals));
      goalInput.value = "";
      renderGoals();
    });

    renderGoals();
  }

  dailyGoals();
}

DailyGoals();

function ThemeChange() {
  let theme = document.querySelector("#themeToggle");
  let todoimg = document.querySelector(".allFeatures .todo");
  let plannerimg = document.querySelector(".allFeatures .planner");
  let motivationimg = document.querySelector(".allFeatures .motivation");
  let pomoimg = document.querySelector(".allFeatures .pomo");
  let goalsimg = document.querySelector(".allFeatures .goals");

  theme.addEventListener("change", function () {
    if (theme.checked) {
      document.documentElement.style.setProperty("--primary", "#222831");
      document.documentElement.style.setProperty("--secondary", "#393E46");
      document.documentElement.style.setProperty("--seconday2", "#948979");
      document.documentElement.style.setProperty("--tri", "#DFD0B8");

      function Imagechange() {
        todoimg.src =
          "https://images.unsplash.com/photo-1622737133809-d95047b9e673?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        plannerimg.src =
          "https://images.unsplash.com/photo-1601315488950-3b5047998b38?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        motivationimg.src =
          "https://plus.unsplash.com/premium_photo-1695322790437-d27413ea61da?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        pomoimg.src =
          "https://images.unsplash.com/photo-1766179031087-088a7d0e9ae3?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        goalsimg.src =
          "https://plus.unsplash.com/premium_photo-1675278299588-80bdf4439324?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      }
      Imagechange();
    } else {
      document.documentElement.style.setProperty(
        "--primary",
        "rgb(84, 41, 41)",
      );
      document.documentElement.style.setProperty(
        "--secondary",
        " rgb(125, 72, 72)",
      );
      document.documentElement.style.setProperty(
        "--seconday2",
        "rgb(189, 147, 147)",
      );
      document.documentElement.style.setProperty("--tri", "rgb(241, 241, 113)");

      function resetImagechange() {
        todoimg.src =
          "https://images.unsplash.com/photo-1662027008658-b615840c7deb?q=80&w=1162&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        plannerimg.src =
          "https://plus.unsplash.com/premium_photo-1677109899391-f661ac45d798?q=80&w=720&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        motivationimg.src =
          "https://plus.unsplash.com/premium_photo-1685885584657-f1a5d2af5d99?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        pomoimg.src =
          "https://images.unsplash.com/photo-1718803597223-f7beeb310d3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        goalsimg.src =
          "https://plus.unsplash.com/premium_photo-1700675175397-7cc710d56e11?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      }
      resetImagechange();
    }
  });
}
ThemeChange();
