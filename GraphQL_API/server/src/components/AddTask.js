import { graphql } from "react-apollo";
import React, { useState } from "react";
import { flowRight as compose } from "lodash";
import { getProjectsQuery, getTasksQuery, addTaskMutation } from "../queries/queries";

function AddTask(props) {
  function displayProjects() {
    const { loading, projects } = props.getProjectsQuery;
    if (loading) {
      return <option disabled>Loading projects...</option>;
    } else {
      return projects.map(project => {
        return (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        );
      });
    }
  }
  const [inputs, setInputs] = useState({
    title: '',
    weight: 1,
    description: '',
    projectId: ''
  });


  const handleChange = (e) => {
        const newInputs = {
          ...inputs
        };
        if (e.target.name === "weight") newInputs[e.target.name] = parseInt(e.target.value)
        else newInputs[e.target.name] = e.target.value
        setInputs(newInputs)
  }

  const subitForm = (e) => {
    e.preventDefault();
    props.addTaskMutation({
      variables: {
        title: inputs.title,
        weight: parseInt(inputs.weight),
        description: inputs.description,
        projectId: inputs.projectId
      },
      refetchQueries: [{ query: getTasksQuery }]
    });
  }

  return (
  <form className = "task" id = "add-task" onSubmit = {subitForm}>
    <div className = "field" >
    <label > Task title: </label>
    <input type = "text"
    name = "title"
    onChange = {
      handleChange
    }
    value = {
      inputs.title
    }
    required/>
    </div>
    <div className = "field" >
    <label > Weight: </label>
    <input type = "number"
    name = "weight"
    onChange = {
      handleChange
    }
    value = {
      inputs.weight
    }
    required/>
    </div>
      <div className="field">
        <label>Project:</label>
        <select
          name="projectId"
          onChange={handleChange}
          value={inputs.projectId}
          required>
          <option value="" disabled>Select project</option>
          {displayProjects()}
        </select>
      </div>
      <button>+</button>
    </form>
  );
}

export default compose(
  graphql(getProjectsQuery, { name: "getProjectsQuery" }),
  graphql(addTaskMutation, { name: "addTaskMutation" })
)(AddTask);