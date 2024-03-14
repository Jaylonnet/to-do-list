import storageManager from "./storagemanager";

const storage = storageManager();

const idCounter = (() => {
    let projectId = 0;
    let taskId = 0;

    const generateProjectId = () => {
        projectId++;
        return projectId;
    };

    const generateTaskId = () => {
        taskId++;
        return taskId;
    };

    return { generateProjectId, generateTaskId }
})();

function save() {
    const projects = projectManager.getAllProjects();
    storage.populateStorage('projects', projects);
};

function loadStoredProjects() {
    const storedProjects = storage.retrieveStorage("projects");

    if (!storedProjects) return;

    storedProjects.forEach(storedProject => {
        const newProject = projectManager.createProject(storedProject.name);
        const storedTasks = storedProject.tasks;

        storedTasks.forEach(storedTask => {
            newProject.createTask(storedTask.name, storedTask.description, storedTask.status);
        })
    });
};

const project = (name) => {
    let id = idCounter.generateProjectId();
    const tasks = [];

    const getId = () => id;
    const getName = () => name;
    const setName = (newName) => { name = newName };
    const getAllTasks = () => tasks;

    const task = (id, name, description, status) => {
        return { id, name, description, status }
    };

    const createTask = (name, description, status = false) => {
        const id = idCounter.generateTaskId();
        const newTask = task(id, name, description, status);
        tasks.push(newTask);
        save();
        return newTask;
    };

    const getTaskById = (taskId) => {
        const task = tasks.find((task) => task.id === taskId);
        return task;
    };

    const updateTaskById = (taskId, name, description, status) => {
        const taskToUpdate = getTaskById(taskId);
        if (taskToUpdate) {
            taskToUpdate.name = name !== undefined ? name : taskToUpdate.name;
            taskToUpdate.description = description !== undefined ? description : taskToUpdate.description;
            taskToUpdate.status = status !== undefined ? status : taskToUpdate.status;
            save();
            return taskToUpdate;
        }
    };

    const deleteTaskById = (taskId) => {
        const task = getTaskById(taskId);
        if (task) {
            const index = tasks.indexOf(task);
            tasks.splice(index, 1);
            save();
            return true;
        }
        return false;
    };

    return { id, name, tasks, getId, getName, setName, getAllTasks, getTaskById, createTask, updateTaskById, deleteTaskById }
};

const projectManager = (() => {
    const projects = [];

    const getAllProjects = () => projects;

    const createProject = (name) => {
        const newProject = project(name);
        projects.push(newProject);
        save();
        return newProject;
    };

    const getProjectById = (projectId) => {
        const project = projects.find((project) => project.id === projectId);
        return project;
    };

    const updateProjectById = (projectId, name) => {
        const projectToUpdate = getProjectById(projectId);
        if (projectToUpdate) {
            projectToUpdate.name = name !== undefined ? name : projectToUpdate.name;
            save();
            return projectToUpdate;
        }
    };

    const deleteProjectById = (projectId) => {
        const project = getProjectById(projectId);
        if (project) {
            const index = projects.indexOf(project);
            projects.splice(index, 1);
            save();
            return true;
        }
        return false;
    };

    const init = () => {
        loadStoredProjects();

        if (getAllProjects().length === 0) {
            createProject("Default Project");
        }
    };

    return { projects, init, getAllProjects, createProject, getProjectById, updateProjectById, deleteProjectById }
})();

export default projectManager;