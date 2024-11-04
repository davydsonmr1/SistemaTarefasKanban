// Array para armazenar as tarefas
let tasks = {
    todo: [],
    "in-progress": [],
    done: []
  };
  
  // Função para adicionar uma nova tarefa
  function addTask(columnId) {
    const taskText = prompt("Digite a descrição da tarefa:");
    if (taskText) {
      const task = { id: Date.now(), text: taskText };
      tasks[columnId].push(task);
      renderTasks();
      saveTasks();
    }
  }
  
  /// Função para renderizar as tarefas nas colunas, incluindo o botão de exclusão
function renderTasks() {
    Object.keys(tasks).forEach(columnId => {
      const column = document.getElementById(columnId).querySelector(".task-list");
      column.innerHTML = "";
      tasks[columnId].forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";
        taskElement.draggable = true;
        taskElement.ondragstart = (e) => dragTask(e, columnId, task.id);
  
        // Conteúdo da tarefa
        const taskContent = document.createElement("span");
        taskContent.innerText = task.text;
        taskElement.appendChild(taskContent);
  
        // Botão de exclusão
        const deleteButton = document.createElement("span");
        deleteButton.className = "delete-task";
        deleteButton.innerText = "✖";
        deleteButton.onclick = () => deleteTask(columnId, task.id);
        taskElement.appendChild(deleteButton);
  
        column.appendChild(taskElement);
      });
    });
    updateProgressBar();
  }
  
  // Função para excluir uma tarefa
  function deleteTask(columnId, taskId) {
    tasks[columnId] = tasks[columnId].filter(task => task.id !== taskId);
    renderTasks();
    saveTasks();
  }
  
  
  // Funções de arrastar e soltar
  function dragTask(event, columnId, taskId) {
    event.dataTransfer.setData("taskId", taskId);
    event.dataTransfer.setData("columnId", columnId);
  }
  
  document.querySelectorAll(".column").forEach(column => {
    column.ondragover = (e) => e.preventDefault();
    column.ondrop = (e) => dropTask(e, column.id);
  });
  
  function dropTask(event, targetColumnId) {
    const taskId = event.dataTransfer.getData("taskId");
    const sourceColumnId = event.dataTransfer.getData("columnId");
  
    const taskIndex = tasks[sourceColumnId].findIndex(task => task.id == taskId);
    const [task] = tasks[sourceColumnId].splice(taskIndex, 1);
    tasks[targetColumnId].push(task);
  
    renderTasks();
    saveTasks();
  }
  
  // Chama o render no início para carregar as tarefas salvas
  renderTasks();
  // Salvar tarefas no LocalStorage
function saveTasks() {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }
  
  // Carregar tarefas do LocalStorage
  function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("kanbanTasks"));
    if (savedTasks) {
      tasks = savedTasks;
      renderTasks();
    }
  }
  
  // Chamada para carregar as tarefas ao iniciar
  loadTasks();
 // Atualiza a barra de progresso e exibe a porcentagem
 function updateProgressBar() {
    const totalTasks = tasks.todo.length + tasks["in-progress"].length + tasks.done.length;
    const completedTasks = tasks.done.length;
    const progressPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  
    const progressBar = document.getElementById("progress");
    progressBar.style.width = `${progressPercentage}%`;
  
    // Atualizando o texto de porcentagem
    const progressText = document.getElementById("progress-percentage");
    progressText.innerText = `${Math.round(progressPercentage)}%`;
  }
  
  
  