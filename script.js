//constants declared for input button and task list area
const taskInput = document.querySelector("#newtask input");
const taskList = document.querySelector(".tasks");

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
        };
    });

    // Add overflow class if the task list is too long
    if (taskList.offsetHeight >= 500) {
        taskList.classList.add("overflow");
    } else {
        taskList.classList.remove("overflow");
    }
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
}



