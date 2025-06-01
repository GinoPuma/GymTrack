const express = require("express");
const {
  getMyClients,
  getClientDetails,
  getMyTrainer,
  getAllTrainers,
  getAllUsers, 
  getUserById, 
  updateUserRole, 
  deleteUser,
} = require("../controllers/userController");
const {
  protect,
  trainer,
  client,
  admin,
} = require("../middleware/authMiddleware"); 

const router = express.Router();

router.get("/clients", protect, trainer, getMyClients);
router.get("/clients/:id", protect, trainer, getClientDetails);
router.get("/my-trainer", protect, client, getMyTrainer);
router.get("/trainers", getAllTrainers); 

router.get("/", protect, admin, getAllUsers); 
router.get("/:id", protect, admin, getUserById); 
router.put("/:id/role", protect, admin, updateUserRole); 
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
