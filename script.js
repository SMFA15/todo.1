
// ========================================
// 1. SELECTING HTML ELEMENTS
// ========================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");


// ========================================
// 2. INITIALIZING VARIABLES
// ========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let editTaskId = null;


// ========================================
// 3. CREATE OPERATION
// ========================================

function addTask() {

    const taskText = taskInput.value.trim();

    // Check empty input
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // UPDATE existing task
    if (editTaskId !== null) {

        const task = tasks.find(
            task => task.id === editTaskId
        );

        if (task) {
            task.text = taskText;
        }

        editTaskId = null;
        addTaskBtn.textContent = "+ Add Task";

    }

    // CREATE new task
    else {

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);

    }

    // Clear input
    taskInput.value = "";

    saveTasks();
    displayTasks();

}


// ========================================
// 4. READ OPERATION
// ========================================

function displayTasks() {

    taskList.innerHTML = "";

    // Filter tasks
    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;

    });

    // Display empty message
    if (filteredTasks.length === 0) {

        const emptyMessage = document.createElement("li");

        emptyMessage.textContent = "No tasks available.";

        taskList.appendChild(emptyMessage);

    }

    // Display each task
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.classList.add("task-item");

        // Task text
        const taskText = document.createElement("span");

        taskText.textContent = task.text;

        if (task.completed) {
            taskText.style.textDecoration = "line-through";
            taskText.style.opacity = "0.5";
        }

        // Complete button
        const completeBtn = document.createElement("button");

        completeBtn.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeBtn.onclick = function () {
            toggleTask(task.id);
        };

        // Edit button
        const editBtn = document.createElement("button");

        editBtn.textContent = "Edit";

        editBtn.onclick = function () {
            editTask(task.id);
        };

        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = function () {
            deleteTask(task.id);
        };

        // Add elements to task item
        li.appendChild(taskText);
        li.appendChild(completeBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    updateStatistics();

}


// ========================================
// 5. UPDATE OPERATION - EDIT TASK
// ========================================

function editTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (task) {

        taskInput.value = task.text;

        editTaskId = id;

        addTaskBtn.textContent = "Update Task";

        taskInput.focus();

    }

}


// ========================================
// 6. DELETE OPERATION
// ========================================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(
        task => task.id !== id
    );

    // Cancel edit if deleted task was being edited
    if (editTaskId === id) {

        editTaskId = null;

        taskInput.value = "";

        addTaskBtn.textContent = "+ Add Task";

    }

    saveTasks();
    displayTasks();

}


// ========================================
// 7. MARK TASK AS COMPLETED
// ========================================

function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    displayTasks();

}


// ========================================
// 8. FILTER TASKS
// ========================================

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        currentFilter = this.dataset.filter;

        // Remove active class from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Activate selected button
        this.classList.add("active");

        displayTasks();

    });

});


// ========================================
// 9. UPDATE TASK STATISTICS
// ========================================

function updateStatistics() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


// ========================================
// 10. LOCAL STORAGE
// ========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ========================================
// 11. EVENT LISTENERS
// ========================================

// Add or update task using button
addTaskBtn.addEventListener("click", addTask);


// Add task using Enter key
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// ========================================
// 12. INITIALIZE APPLICATION
// ========================================

displayTasks();
