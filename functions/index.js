require("./plugins/firebase");
const user = require("./service/user");
const notebook = require("./service/notebook");
const notebookMember = require("./service/notebookMember");

exports.createUser = user.createUser;
exports.deleteUser = user.deleteUser;
exports.updateUser = user.updateUser;
exports.createNotebookTag = notebook.createNotebookTag;
exports.updateNotebookTag = notebook.updateNotebookTag;
exports.deleteNotebookTag = notebook.deleteNotebookTag;
exports.createNotebookMember = notebookMember.createNotebookMember;