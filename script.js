//constants declared for input button and task list area
const taskInput = document.querySelector("#newtask input");
const taskList = document.querySelector(".tasks");

// Load tasks from local storage when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadTasksFromStorage();
});

// Add a new task when the user presses Enter in the input field
taskInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        createTask();
    }
});

// Add a new task when the user clicks the 'Add' button
document.querySelector('#push').onclick = function () {
    createTask();
};

// Function to save tasks to local storage
function saveTasksToStorage() {
    const tasks = [];
    const taskElements = document.querySelectorAll('.task');

    taskElements.forEach(function (taskElement) {
        const taskText = taskElement.querySelector('p').textContent;
        const isCompleted = taskElement.querySelector('input[type="checkbox"]').checked;

        tasks.push({
            text: taskText,
            completed: isCompleted
        });
    });

    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('todoTasks');

    if (savedTasks) {
        const tasks = JSON.parse(savedTasks);

        // Clear existing tasks first
        taskList.innerHTML = '';

        // Add each saved task
        tasks.forEach(function (task) {
            createTaskFromData(task.text, task.completed);
        });

        // Add overflow class if needed
        if (taskList.offsetHeight >= 500) {
            taskList.classList.add("overflow");
        }
    }
}

// Function to create a task from saved data
function createTaskFromData(taskText, isCompleted) {
    const checkedClass = isCompleted ? 'checked' : '';
    const checkedAttribute = isCompleted ? 'checked' : '';

    taskList.insertAdjacentHTML('beforeend', `
        <div class="task">
            <label id="taskname">
                <input onclick="updateTask(this)" type="checkbox" id="check-task" ${checkedAttribute}>
                <p class="${checkedClass}">${taskText}</p>
            </label>
            <div class="delete">
                <i class="uil uil-trash"></i>
            </div>
        </div>
    `);

    // Add delete functionality to the new delete button
    const newDeleteBtn = taskList.lastElementChild.querySelector('.delete');
    newDeleteBtn.onclick = function () {
        this.parentNode.remove();
        saveTasksToStorage(); // Save after deletion
    };
}

// Function to create and add a new task
function createTask() {
    // If the input is empty, show an alert
    if (taskInput.value.length === 0) {
        alert("The task field is blank. Enter a task name and try again.");
        return;
    }

    // Add the new task at the top of the list
    taskList.insertAdjacentHTML('afterbegin', `
        <div class="task">
            <label id="taskname">
                <input onclick="updateTask(this)" type="checkbox" id="check-task">
                <p>${taskInput.value}</p>
            </label>
            <div class="delete">
                <i class="uil uil-trash"></i>
            </div>
        </div>
    `);

    // Clear the input field for the next task
    taskInput.value = "";

    // Add delete functionality to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(function (deleteBtn) {
        deleteBtn.onclick = function () {
            this.parentNode.remove();
            saveTasksToStorage(); // Save after deletion
        };
    });

    // Add overflow class if the task list is too long
    if (taskList.offsetHeight >= 500) {
        taskList.classList.add("overflow");
    } else {
        taskList.classList.remove("overflow");
    }

    // Save tasks to local storage after adding new task
    saveTasksToStorage();
}

// Function to update a task when its checkbox is clicked
function updateTask(checkbox) {
    // Get the <p> element that displays the task text
    let taskText = checkbox.parentElement.lastElementChild;
    // Get the parent .task div
    const taskDiv = checkbox.closest('.task');

    if (checkbox.checked) {
        // Add line-through style
        taskText.classList.add("checked");
        // Move the checked task to the end of the list
        taskList.appendChild(taskDiv);
    } else {
        // Remove line-through style
        taskText.classList.remove("checked");
        // Move the unchecked task above all checked tasks
        const allTasks = Array.from(taskList.children);
        const firstChecked = allTasks.find(t => t.querySelector('input[type="checkbox"]').checked);
        if (firstChecked) {
            taskList.insertBefore(taskDiv, firstChecked);
        } else {
            taskList.insertBefore(taskDiv, taskList.firstChild);
        }
    }

    // Save tasks to local storage after updating
    saveTasksToStorage();
}