//UI variables 
const form = document.querySelector('#task-form'); //The form at the top
const taskInput = document.querySelector('#task'); //the task input text field

//read from q string 
const urlParams = new URLSearchParams(window.location.search);
const id = Number(urlParams.get('id'));
var dateString = urlParams.get('date');
dateString = dateString.slice(0, dateString.indexOf('G') - 1);

const date = new Date(dateString);






//DB
var DB;

// Add Event Listener [on Load]
document.addEventListener('DOMContentLoaded', () => {
    // create the database
    let TasksDB = indexedDB.open('tasks', 1);
     // display the Task 
   
    TasksDB.onsuccess =  function() {
        console.log('Database Ready');
        // save the result
        DB = TasksDB.result;
        displayTask()
    }
    

    function displayTask() {
        
        var transaction = DB.transaction(['tasks']);
        var objectStore = transaction.objectStore('tasks');
        var request = objectStore.get(id);

        request.onsuccess = function(event) {
            if (request.result) {
                taskInput.value = request.result.taskName;

            } else {
                console.log('No data record');
            }
        };

        request.onerror = function(event) {
            console.log('Transaction failed');
        };

    }


    form.addEventListener('submit', updateTask);

    function updateTask(e) {
        e.preventDefault();

        // Check empty entry
        if (taskInput.value === '') {
            taskInput.style.borderColor = "red";

            return;
        }

        /* 
        Instruction set to handle Update

        1. Declare the transaction and object store objects 
        2. Use the id on put method of index db
        
        */

        function Task(dateCreated, taskName, id) {
            this.dateCreated = dateCreated;
            this.taskName = taskName;
            this.id = id;
        }

        let transaction = DB.transaction("tasks", 'readwrite');
        let objectStore = transaction.objectStore("tasks");
        
        
        let request = objectStore.put(new Task(date,taskInput.value,id));
        request.onsuccess = function() {
            console.log("Task Successfully updated");
        };
        request.onerror = function() {
            console.log("Task Not updated");
        }
        history.back();
    }




});