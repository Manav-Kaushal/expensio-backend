const express = require("express");

const router = express.Router();

const { createUser, loginUser } = require("../controllers/users");

router.route("/register").post(createUser);
router.route("/login").post(loginUser);

// router.route("/:id").delete(deleteTransactions);

module.exports = router;
