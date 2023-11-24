document.addEventListener("DOMContentLoaded", function () {
  // Retrieve tasks from local storage on page load
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render existing tasks
  renderTasks(tasks);

  // Event listener for the new task form
  document.getElementById("new-task-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the new task input value
    const newTaskInput = document.getElementById("new-task-input");
    const taskText = newTaskInput.value.trim();

    // Check if the input is not empty
    if (taskText !== "") {
      // Check if the task is already in the list
      if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        // Show the notification
        showNotification("Task already in the list!");
        return;
      }

      // Create a new task object
      const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false, // Default to not completed
      };

      // Add the new task to the tasks array
      tasks.push(newTask);

      // Save tasks to local storage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Show encouragement and cartoon character
      document.getElementById("encouragement").style.display = "block";
      document.getElementById("cartoon-character").style.display = "block";

      // Hide encouragement and cartoon character after 3 seconds
      setTimeout(() => {
        document.getElementById("encouragement").style.display = "none";
        document.getElementById("cartoon-character").style.display = "none";
      }, 3000);

      // Clear the input field
      newTaskInput.value = "";

      // Render the updated task list
      renderTasks(tasks);
    }
  });

  // Function to toggle task completion
  window.toggleTaskCompletion = function (taskId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      // Check if the task is transitioning from incomplete to complete
      const transitioningToComplete = !tasks[taskIndex].completed && !document.getElementById(taskId).classList.contains("completed");

      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks);

      // Trigger celebration animation if transitioning to complete
      if (transitioningToComplete) {
        celebrate(taskId);
      }
    }
  };

  // Function to render tasks
  function renderTasks(tasks) {
    const tasksContainer = document.getElementById("tasks");
    tasksContainer.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task");
      taskElement.id = task.id;

      // Add a completed class if the task is completed
      const completedClass = task.completed ? "completed" : "";
      const infoMessage = task.completed ? "Task completed!  " : "";

      taskElement.innerHTML = `
        <div class="info-message ${completedClass}">${infoMessage}</div>
        <div class="content ${completedClass}">
          <input type="text" class="text" value="${task.text}" readonly>
        </div>
        <div class="actions">
          <button class="edit" onclick="editTask(${task.id})"><i class="fas fa-edit"></i> Edit</button>
          <button class="save" onclick="saveTask(${task.id})"><i class="fas fa-save"></i> Save</button>
          <button class="delete" onclick="deleteTask(${task.id})"><i class="fas fa-trash-alt"></i> Delete</button>
          <button class="complete" onclick="toggleTaskCompletion(${task.id})">${
        task.completed ? '<i class="fas fa-undo"></i> Undo' : '<i class="fas fa-check"></i> Complete'
      }</button>
        </div>
      `;

      tasksContainer.appendChild(taskElement);

      // Add animate-in class for a smooth entry animation
      setTimeout(() => {
        taskElement.classList.add("animate-in");
      }, 0);
    });
  }

  // Function to edit a task
  window.editTask = function (taskId) {
    const tasksIndex = tasks.findIndex((task) => task.id === taskId);
    if (tasksIndex !== -1) {
      const taskElement = document.querySelector(`.task:nth-child(${tasksIndex * 2 + 1})`);
      const textElement = taskElement.querySelector(".text");
      const saveButton = taskElement.querySelector(".save");

      textElement.removeAttribute("readonly");
      saveButton.style.display = "inline"; // Show the Save button
      textElement.focus();
    }
  };

  // Function to save a task
  window.saveTask = function (taskId) {
    const tasksIndex = tasks.findIndex((task) => task.id === taskId);
    if (tasksIndex !== -1) {
      const taskElement = document.querySelector(`.task:nth-child(${tasksIndex * 2 + 1})`);
      const textElement = taskElement.querySelector(".text");
      const saveButton = taskElement.querySelector(".save");

      const newText = textElement.value.trim();
      if (newText !== "") {
        tasks[tasksIndex].text = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks(tasks);
      } else {
        // If the edited text is empty, revert to the original text
        textElement.value = tasks[tasksIndex].text;
      }

      // Set the input field back to readonly and hide the Save button
      textElement.setAttribute("readonly", "readonly");
      saveButton.style.display = "none";
    }
  };

  // Function to delete a task
  window.deleteTask = function (taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      const filteredTasks = tasks.filter((task) => task.id !== taskId);
      localStorage.setItem("tasks", JSON.stringify(filteredTasks));
      renderTasks(filteredTasks);

      // Reload the page after deleting a task
      location.reload();
    }
  };

  // Function to trigger celebration animation
  function celebrate(taskId) {
    const taskElement = document.getElementById(taskId);
    taskElement.classList.add("celebrate");

    // Remove the celebration class after the animation ends
    taskElement.addEventListener("animationend", function () {
      taskElement.classList.remove("celebrate");
    });
  }

  // Function to show the notification
  function showNotification(message) {
    const notificationElement = document.getElementById("notification");
    notificationElement.innerText = message;
    notificationElement.style.display = "block";

    // Hide the notification after 3 seconds
    setTimeout(() => {
      notificationElement.style.display = "none";
    }, 3000);
  }
});
