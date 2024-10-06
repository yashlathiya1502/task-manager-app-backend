import { Task } from '../models/task.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'Title and description are required'));
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'TODO', 
      user: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, task, 'Task created successfully'));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Task creation failed'));
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    if (!tasks.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], 'No tasks found for the user'));
    }

    return res.status(200).json(new ApiResponse(200, tasks, 'Tasks retrieved successfully'));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to retrieve tasks'));
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, 'Title and description are required'));
      }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user._id },
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, 'Task not found or not authorized'));
    }

    return res.status(200).json(new ApiResponse(200, updatedTask, 'Task updated successfully'));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to update task'));
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: req.user._id });

    if (!deletedTask) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, 'Task not found or not authorized'));
    }

    return res.status(200).json(new ApiResponse(200, deletedTask, 'Task deleted successfully'));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to delete task'));
  }
};

export const changeTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['TODO', 'INPROGRESS', 'DONE'].includes(status)) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, 'Invalid status value'));
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user._id },
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, 'Task not found or not authorized'));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTask, 'Task status updated successfully'));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Failed to update task status'));
  }
};
