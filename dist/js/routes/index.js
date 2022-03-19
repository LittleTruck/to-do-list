"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos_1 = require("../controllers/todos");
const router = (0, express_1.Router)();
router.route('/api/todos')
    .get(todos_1.getTodos)
    .post(todos_1.addTodo);
exports.default = router;
