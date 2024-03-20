const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
// const _ = require('lodash'); // Used to find data in the dummy data
const Project = require('../models/project');
const Task = require('../models/task');

// Dummy data for the tasks
// const tasks = [
//     { id: '1', title: 'Create your first webpage', weight: 1, description: 'Create your first HTML file 0-index.html with: -Add the doctype on the first line (without any comment) -After the doctype, open and close a html tag Open your file in your browser (the page should be blank)', projectId: '1'},
//     { id: '2', title: 'Structure your webpage', weight: 1, description: 'Copy the content of 0-index.html into 1-index.html Create the head and body sections inside the html tag, create the head and body tags (empty) in this order', projectId: '1'},
// ];

// // Dummy data for the projects
// const projects = [
//     { id: '1', title: 'Advanced HTML', weight: 1, description: 'Welcome to the Web Stack specialization. The 3 first projects will give you all basics of the Web development: HTML, CSS and Developer tools. In this project, you will learn how to use HTML tags to structure a web page. No CSS, no styling - don’t worry, the final page will be “ugly” it’s normal, it’s not the purpose of this project. Important note: details are important! lowercase vs uppercase / wrong letter… be careful!'},
//     { id: '2', title: 'Bootstrap', weight: 1, description: 'Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS and JavaScript design templates for typography, forms, buttons, navigation, and other interface components.'},
// ];

// Define the task type
const TaskType = new GraphQLObjectType({
    name: 'Task',
    fields: () => ({ // Using a function to avoid circular dependencies
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        weight: { type: GraphQLInt },
        description: { type: GraphQLString },
        // Define the project field with relation to the ProjectType
        project: {
            type: ProjectType,
            resolve: (parent, args) => {
                // Use the Project model to find the project with the id
                return Project.findById(parent.projectId);
            }
        }
    })
});

// Define the project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({ // Using a function to avoid circular dependencies
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        weight: { type: GraphQLInt },
        description: { type: GraphQLString },
        // Define the tasks field with relation to the TaskType
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: (parent, args) => {
                // Use the Task model to find all tasks associated with this project
                return Task.find({ projectId: parent.id });
            }
        }
    })
});

// Define the root query with the task and project fields
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        task: {
            type: TaskType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                // Use the Task model to find a single task by ID
                return Task.findById(args.id);
            }
        },
        project: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (parent, args) => {
                // Use the Project model to find a single project by ID
                return Project.findById(args.id);
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve: (parent, args) => {
                // Use the Task model to find all tasks
                return Task.find({});
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve: (parent, args) => {
                // Use the Project model to find all projects
                return Project.find({});
            }
        }
    }
});

// Define the mutation to add a task and project
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTask: {
            type: TaskType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                weight: { type: new GraphQLNonNull(GraphQLInt) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                projectId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (parent, args) => {
                // Create a new task with the args
                let task = new Task({
                    title: args.title,
                    weight: args.weight,
                    description: args.description,
                    projectId: args.projectId
                });
                // Save the task in the database
                return task.save();
            }
        },
        addProject: {
            type: ProjectType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                weight: { type: new GraphQLNonNull(GraphQLInt) },
                description: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                // Create a new project with the args
                let project = new Project({
                    title: args.title,
                    weight: args.weight,
                    description: args.description
                });
                // Save the project in the database
                return project.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});