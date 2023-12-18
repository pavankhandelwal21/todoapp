const sortByBtn = document.getElementById("sort-by-btn");
const todoPriority = document.getElementById("todo-priority");
const todoRange = document.getElementById("todo-range");
const todaysDate = document.getElementById("todays-date");
const todaysWeek = document.getElementById("todays-week");
const closeBtn = document.getElementById("close-btn");
const addEditPopup = document.getElementById("add-edit-popup");
const addEditTodo = document.getElementById("add-edit-todo");
const addTodoBtn = document.getElementById("add-todo-btn");
const editTodoBtn = document.getElementById("edit-todo-btn");
const todoBodyBox = document.getElementById("todo-body-box");
const todoBody = document.getElementById("todo-body");
const todoCompleted = document.getElementById("completed-checkbox");
const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");
const todoPopupHeading = document.getElementById("todo-popup-heading");

const date = new Date();
let todoarray = [];
let selectIdToEdit;
let indexToEdit;
// console.log(date.getHours());

todoPriority.textContent = todoRange.value;

function randomid(){
    return Math.floor(Math.random() * Date.now()).toString(16);
}
function generateDate(needweek, needdate){
    if (needweek == 1){
        return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    else if (needdate == 1){
        return ("Happy" + " " + date.toLocaleDateString('en-US', { weekday: 'long' }) + " " + "😎");
    }
}
function hideAddEditPopup(){
    addEditPopup.classList.add('hide');
    addTodoBtn.classList.remove('hide');
    editTodoBtn.classList.remove('hide');
    todoBodyBox.value = "";
}
function hoursNminutes(){
    let meridium = (date.getHours() >= 12)?"p.m":"a.m";
    let datetime = ((('0'+((date.getHours() + 11) % 12 + 1)).substr(-2)) + ":" +  (('0'+date.getMinutes()).substr(-2)) + " " + meridium);
    return datetime;
}
function object(arr, todobodyvalue, priority){
    arr["id"] = `classic-${randomid()}`
    arr["todobody"] = todobodyvalue;
    arr["priority"] = priority;
    arr["completed"] = todoCompleted.checked == true? true : false;
    arr["LastUpdated"] = (generateDate(1, 0) + " at " + hoursNminutes());
    arr["AddedDate"] = (generateDate(1, 0) + " at " + hoursNminutes());
}
function editObject(todobodyvalue, priority){
    indexToEdit.todobody = todobodyvalue;
    indexToEdit.priority = priority;
    indexToEdit.completed = todoCompleted.checked == true? true : false;
    indexToEdit.LastUpdated = (generateDate(1, 0) + " at " + hoursNminutes());
    indexToEdit.AddedDate = indexToEdit.AddedDate;
}
function buildCard(todo){
    if (todo["completed"] == true){
        todoBody.innerHTML += 
        `<div class="todolist-container margintopbottom-20 completedborderbox">
            <div class="todolist-heading">
                <p class="blue margin-10 card-heading"><label>Priority - ${todo.priority}</label></p>
                <p class="completedcolor margin-10 card-heading">Completed</p>
            </div>
            <div class="small-font margin-10 blue">Last Updated: <label class = "white">${todo.LastUpdated}</label></div>
            <div class="todolist-body completedcolor"><h2><s>${todo.todobody}</s></h2></div>
            <div class="todolist-footer">
                <p class="small-font margin-10 green">Added: <label class = "white">${todo.AddedDate}</label></p>
                <div id="${todo.id}" class="d-flex">
                    <p name ="delete-todo" class="red small-font margin-10 padding-2 pointer delete-todo-btn">delete</p>
                    <p name ="edit-todo" class="blue small-font margin-10 padding-2 pointer edit-todo-btn">edit</p>
                </div>
            </div>
        </div>`;
    }
    else{
        todoBody.innerHTML += 
        `<div class="todolist-container margintopbottom-20 pendingborderbox">
            <div class="todolist-heading">
                <p class="blue margin-10 card-heading"><label>Priority - ${todo.priority}</label></p>
                <p class="pendingcolor margin-10 card-heading">Pending</p>
            </div>
            <div class="small-font margin-10 blue">Last Updated: <label class = "white">${todo.LastUpdated}</label></div>
            <div class="todolist-body pendingcolor"><h2>${todo.todobody}</h2></div>
            <div class="todolist-footer">
                <p class="small-font margin-10 green">Added: <label class = "white">${todo.AddedDate}</label></p>
                <div id="${todo.id}" class="d-flex">
                    <p name ="delete-todo" class="red small-font margin-10 padding-2 pointer delete-todo-btn">delete</p>
                    <p name ="edit-todo" class="blue small-font margin-10 padding-2 pointer edit-todo-btn">edit</p>
                </div>
            </div>
        </div>`;
    }
}
function noTodoCard(){
    if (todoarray.length) {
        document.querySelector('#emptytodo').classList.add('displaynone');
    }
}
function storeinlocalstorage(todoarray){
    localStorage.setItem("stored__todos", JSON.stringify(todoarray));
}

function bindDeleteBtnEvent(){
    const isdeleted = document.querySelectorAll('.delete-todo-btn');
    
    isdeleted.forEach(deleted =>{
        deleted.addEventListener("click", (e)=>{
            const selectedId = e.target.parentElement.id;
            if (todoarray.length && selectedId) {
                // for (let i=0; i<todoarray.length; i++){
                //     if (selectedId === todoarray[i]["id"]){
                //         return todoarray.splice(i,1);
                //     }
                // }

                // method 1:
                // const indexToRemove = todoarray.findIndex(t => t.id == selectedId);
                // todoarray.splice(indexToRemove, 1);

                // method 2:
                todoarray = todoarray.filter(t => t.id !== selectedId);

                // console.log(todoarray);
                storeinlocalstorage(todoarray);
                createcards()
            }
        })
    })
}
function bindEditBtnEvent(){
    const isedited = document.querySelectorAll('.edit-todo-btn');

    isedited.forEach(edited =>{
        edited.addEventListener("click", (e)=>{
            selectIdToEdit = e.target.parentElement.id;
            // console.log(selectIdToEdit)
            if (todoarray.length && selectIdToEdit) {
                // console.log(todoarray.findIndex(t => t.id == selectIdToEdit));
                indexToEdit = todoarray[todoarray.findIndex(t => t.id == selectIdToEdit)];
                // console.log(indexToEdit.todobody);
                todoBodyBox.value = indexToEdit.todobody;
                todoPriority.innerHTML = todoRange.value = indexToEdit.priority;
                todoCompleted.checked = indexToEdit.completed;
                todoPopupHeading.innerHTML = `Edit ToDo`;
                // addTodoBtn.value = `Update`;
                addTodoBtn.classList.add('hide');
                addEditPopup.classList.remove('hide');
            }
        })
    })

}
function createcards(){
    todoarray = (JSON.parse(localStorage.getItem("stored__todos")) != null)?JSON.parse(localStorage.getItem("stored__todos")): [] ;
    // console.log(todoarray.length);
    if (todoarray.length){
        todoBody.innerHTML = '';
        // todoarray = [];
        // todoarray = todoarray.concat(items);
        // console.log(todoarray);
        // for (let i=0; i<items.length; i++){
        //     // todoarray.push(items[i]);
        //     cards(items[i]);
        // }
        todoarray.forEach(todo => buildCard(todo));
    } else {
        todoBody.innerHTML = '';
        document.querySelector('#emptytodo').classList.remove('displaynone');

    }
    // console.log(!todoarray.length);
    noTodoCard()
    bindDeleteBtnEvent()
    bindEditBtnEvent()
    totalCount.innerHTML = todoarray.length;
    let pendingcount = 0;
    let completedcount = 0;
    todoarray.forEach(todo => todo.completed?completedcount++:pendingcount++);
    completedCount.textContent = completedcount;
    pendingCount.textContent = pendingcount;
}



sortByBtn.addEventListener("click", ()=>{
    localStorage.clear();
    sortByBtn.classList.toggle('sort-by-blue');
    document.querySelector('#sort-list').classList.toggle('show-sorted-list');
})
todoRange.addEventListener("input", ()=>{
    todoPriority.textContent = todoRange.value;
})
closeBtn.addEventListener("click", ()=>{
    hideAddEditPopup()
})
addEditTodo.addEventListener("click", ()=>{
    todoBodyBox.value = ``;
    todoPriority.innerHTML = todoRange.value = 1;
    todoCompleted.checked = false;
    todoPopupHeading.innerHTML = `Add ToDo`;
    // addTodoBtn.value = `Add`;
    editTodoBtn.classList.add('hide');
    addEditPopup.classList.remove('hide');
})

createcards()
todaysWeek.textContent = generateDate(0, 1);
todaysDate.textContent = generateDate(1, 0);

addTodoBtn.addEventListener("click", ()=>{
    let arr = {};
    let todobodyvalue = todoBodyBox.value;
    let priority = todoRange.value;
    if (todobodyvalue == ""){
        alert("Please enter a ToDo")
    }
    if (todobodyvalue != ""){
        object(arr, todobodyvalue, priority)
        hideAddEditPopup()
        todoarray.push(arr);
        // console.log(arr);
        storeinlocalstorage(todoarray)
        createcards()
    }
})

editTodoBtn.addEventListener("click", ()=>{
    // let arr = {};
    let todobodyvalue = todoBodyBox.value;
    let priority = todoRange.value;
    if (todobodyvalue == ""){
        alert("Please enter a ToDo")
    }
    if (todobodyvalue != "" && selectIdToEdit == indexToEdit.id){
        editObject(todobodyvalue, priority);
        storeinlocalstorage(todoarray);
        hideAddEditPopup();
        createcards();
    }
})


// bindDeleteBtnEvent()



