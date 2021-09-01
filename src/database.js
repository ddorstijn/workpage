import lf from "lovefield";

var DatabaseModule = (function() {
  'use strict';

  var _schemaBuilder;
  var _db;
  var _projects;
  var _linkGroups;
  var _links;
  var _tasks;

  return {
    async init() {
      _schemaBuilder = lf.schema.create("workpage", 1);
  
      _schemaBuilder
        .createTable("Projects")
        .addColumn("name", lf.Type.STRING)
        .addColumn("last_used", lf.Type.DATE_TIME)
        .addPrimaryKey(["name"]);
  
      _schemaBuilder
        .createTable("LinkGroups")
        .addColumn("id", lf.Type.INTEGER)
        .addColumn("name", lf.Type.STRING)
        .addColumn("projectName", lf.Type.STRING)
        .addPrimaryKey(["id"], true)
        .addForeignKey("fk_Project", {
          local: "projectName",
          ref: "Projects.name",
          action: lf.ConstraintAction.CASCADE,
        });
  
      _schemaBuilder
        .createTable("Links")
        .addColumn("id", lf.Type.INTEGER)
        .addColumn("name", lf.Type.STRING)
        .addColumn("url", lf.Type.STRING)
        .addColumn("groupId", lf.Type.INTEGER)
        .addPrimaryKey(["id"], true)
        .addForeignKey("fk_LinkId", {
          local: "groupId",
          ref: "LinkGroups.id",
          action: lf.ConstraintAction.CASCADE,
        });
  
      _schemaBuilder
        .createTable("Tasks")
        .addColumn("id", lf.Type.INTEGER)
        .addColumn("title", lf.Type.STRING)
        .addColumn("done", lf.Type.BOOLEAN)
        .addColumn("due", lf.Type.DATE_TIME)
        .addColumn("projectName", lf.Type.STRING)
        .addPrimaryKey(["id"], true)
        .addForeignKey("fk_Project", {
          local: "projectName",
          ref: "Projects.name",
          action: lf.ConstraintAction.CASCADE,
        });

      _db = await _schemaBuilder.connect();
      _projects = _db.getSchema().table("Projects");
      _linkGroups = _db.getSchema().table("LinkGroups");
      _links = _db.getSchema().table("Links");
      _tasks = _db.getSchema().table("Tasks");
    },

    async getProjects() {
      return await _db.select().from(_projects).exec();
    } ,
  
    async addProject(name) {
      _db
        .insertOrReplace()
        .into(_projects)
        .values([
          _projects.createRow({
            name,
            last_used: new Date(),
          }),
        ])
        .exec();
    },
  
    async updateProject(title, oldTitle) {
      _db.update(_projects).set(_projects.name, title).where(_projects.name.eq(oldTitle));
    },
  
    async getLinks(projectName) {
      return await _db.select().from(_linkGroups).leftOuterJoin(_links, _linkGroups.id.eq(_links.groupId)).where(_linkGroups.projectName.eq(projectName)).exec();
    },
  
    async getLinkGroups(projectName) {
      return await _db.select().from(_linkGroups).where(_linkGroups.projectName.eq(projectName)).exec();
    },

    async addLinkGroup(name, projectName) {
      _db
        .insertOrReplace()
        .into(_linkGroups)
        .values([_linkGroups.createRow({ name, projectName })])
        .exec();
    },
  
    async addLink(name, url, groupId) {
      _db
        .insertOrReplace()
        .into(_links)
        .values([
          _links.createRow({
            name,
            url,
            groupId,
        })
      ]).exec();
    },
  
    async updateLink(id, name = null, url = null, groupId = null) {
      _db.update(_links)
        .set(_links.name, name ?? _links.name)
        .set(_links.url, url ?? _links.url)
        .set(_links.groupId, groupId ?? _links.groupId)
        .where(_links.id.eq(id));
    },
  
    async getTasks(activeProject) {
      return await _db.select().from(_tasks).where(_tasks.projectName.eq(activeProject)).exec();
    },
  
    async addTask(title, due, projectName) {
      _db
      .insertOrReplace()
      .into(_tasks)
      .values([
        _tasks.createRow({
          title,
          due,
          done: false,
          projectName,
        })
      ])
      .exec();
    },
  
    async updateTask(id, title = null, due = null, done = null) {
      _db.update(_tasks)
        .set(_tasks.title, title ?? _tasks.title)
        .set(_tasks.due, due ?? _tasks.due)
        .set(_tasks.done, done ?? _tasks.done)
        .where(_tasks.id.eq(id));
    },
  

    async generate_testdata() {
      _db
        .insertOrReplace()
        .into(_projects)
        .values([
          _projects.createRow({
            name: "Test project",
            last_used: new Date(),
          }),
        ])
        .exec();
  
      _db
        .insertOrReplace()
        .into(_linkGroups)
        .values([
          _linkGroups.createRow({
            id: 1,
            name: "Test group",
            projectName: "Test project",
          }),
          _linkGroups.createRow({
            id: 2,
            name: "Link group",
            projectName: "Test project",
          }),
          _linkGroups.createRow({
            id: 3,
            name: "Item list",
            projectName: "Test project",
          }),
        ])
        .exec();
  
      _db
        .insertOrReplace()
        .into(_links)
        .values([
          _links.createRow({
            id: 1,
            name: "Test link",
            url: "https://www.example.com",
            groupId: 1,
          }),
          _links.createRow({
            id: 2,
            name: "Second link",
            url: "https://www.google.com",
            groupId: 1,
          }),
          _links.createRow({
            id: 3,
            name: "First link",
            url: "https://www.google.com",
            groupId: 2,
          }),
          _links.createRow({
            id: 4,
            name: "Another link",
            url: "https://www.google.com",
            groupId: 2,
          }),
          _links.createRow({
            id: 5,
            name: "Third one",
            url: "https://www.google.com",
            groupId: 2,
          }),
          _links.createRow({
            id: 6,
            name: "Soloing",
            url: "https://www.google.com",
            groupId: 3,
          }),
        ])
        .exec();
  
      _db
        .insertOrReplace()
        .into(_tasks)
        .values([
          _tasks.createRow({
            id: 1,
            title: "Test task",
            done: false,
            due: new Date(),
            projectName: "Test project",
          }),
          _tasks.createRow({
            id: 2,
            title: "Another task",
            done: false,
            due: new Date(),
            projectName: "Test project",
          }),
          _tasks.createRow({
            id: 3,
            title: "Third one for good measure",
            done: false,
            due: new Date(),
            projectName: "Test project",
          }),
        ])
        .exec();
    }
  }
})();

// Database initialisation
export default DatabaseModule;