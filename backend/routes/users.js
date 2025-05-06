const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {signup, login} = require("../controllers/auth");
const {assignedTasks, createdTasks, overdueTasks} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);

router.use(authMiddleware);
router.get("/assigned", assignedTasks);
router.get("/created", createdTasks);
router.get("/overdue", overdueTasks);
module.exports = router;