const models = {};

models.student = require("./StudentModel");
models.admin = require("./AdminModel");
models.company = require("./CompanyModel");
models.job = require("./JobsModel");
models.jobApplications = require("./jobApplications");

module.exports = models;