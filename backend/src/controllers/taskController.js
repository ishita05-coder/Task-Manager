const Task = require('../models/Task');
const History = require('../models/History');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    
    await History.create({
      user: req.user._id,
      action: 'CREATED',
      details: `Created task "${createdTask.title}"`,
      task: createdTask._id,
    });
    
    // Emit socket event
    const io = req.app.get('io');
    io.to(req.user._id.toString()).emit('taskAdded', createdTask);
    
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    // Pagination
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    // Filters
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const priorityFilter = req.query.priority ? { priority: req.query.priority } : {};

    const query = { createdBy: req.user._id, ...keyword, ...statusFilter, ...priorityFilter };

    const count = await Task.countDocuments(query);
    
    // Default sorting (e.g., by createdAt desc)
    const sortObj = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sortObj[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
        sortObj.createdAt = -1;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ tasks, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name');

    if (task) {
      res.json(task);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;

      const updatedTask = await task.save();
      
      await History.create({
        user: req.user._id,
        action: 'UPDATED',
        details: `Updated task "${updatedTask.title}"`,
        task: updatedTask._id,
      });
      
      const io = req.app.get('io');
      io.to(req.user._id.toString()).emit('taskUpdated', updatedTask);
      
      res.json(updatedTask);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      const taskTitle = task.title;
      await task.deleteOne();
      
      await History.create({
        user: req.user._id,
        action: 'DELETED',
        details: `Deleted task "${taskTitle}"`,
      });
      
      const io = req.app.get('io');
      io.to(req.user._id.toString()).emit('taskDeleted', req.params.id);
      
      res.json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
      const comment = {
        user: req.user._id,
        text,
      };

      task.comments.push(comment);
      await task.save();
      res.status(201).json(task.comments);
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
};
