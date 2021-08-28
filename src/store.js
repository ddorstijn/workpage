import { writable, get } from "svelte/store";
import lf from 'lovefield';

// Database initialisation
var db;
const schemaBuilder = lf.schema.create('workpage', 1);


schemaBuilder
	.createTable('Projects')
	.addColumn('name', lf.Type.STRING)
	.addColumn('last_used', lf.Type.DATE_TIME)
	.addPrimaryKey(['name']);

schemaBuilder
	.createTable('LinkGroups')
	.addColumn('id', lf.Type.INTEGER)
	.addColumn('name', lf.Type.STRING)
	.addColumn('projectName', lf.Type.STRING)
	.addPrimaryKey(['id'], true)
	.addForeignKey('fk_Project', {
		local: 'projectName',
		ref: 'Projects.name',
		action: lf.ConstraintAction.CASCADE
	});

schemaBuilder
	.createTable('Links')
	.addColumn('id', lf.Type.INTEGER)
	.addColumn('name', lf.Type.STRING)
	.addColumn('url', lf.Type.STRING)
	.addColumn('groupId', lf.Type.INTEGER)
	.addPrimaryKey(['id'], true)
	.addForeignKey('fk_LinkId', {
		local: 'groupId',
		ref: 'LinkGroups.id',
		action: lf.ConstraintAction.CASCADE
	});

schemaBuilder
	.createTable('Tasks')
	.addColumn('id', lf.Type.INTEGER)
	.addColumn('title', lf.Type.STRING)
	.addColumn('done', lf.Type.BOOLEAN)
	.addColumn('due', lf.Type.DATE_TIME)
	.addColumn('projectName', lf.Type.STRING)
	.addPrimaryKey(['id'], true)
	.addForeignKey('fk_Project', {
		local: 'projectName',
		ref: 'Projects.name',
		action: lf.ConstraintAction.CASCADE
	});

async function gen_test(db, t_projects, t_linkGroups, t_links, t_tasks) {
	db.insertOrReplace().into(t_projects).values([
		t_projects.createRow({
			'name': "Test project",
			'last_used': new Date(),
		})
	]).exec();

	db.insertOrReplace().into(t_linkGroups).values([
		t_linkGroups.createRow({
			'id': 1,
			'name': "Test group",
			'projectName': "Test project"
		}),
		t_linkGroups.createRow({
			'id': 2,
			'name': "Link group",
			'projectName': "Test project"
		}),
		t_linkGroups.createRow({
			'id': 3,
			'name': "Item list",
			'projectName': "Test project"
		})
	]).exec();

	db.insertOrReplace().into(t_links).values([
		t_links.createRow({
			'id': 1,
			'name': "Test link",
			'url': "https://www.example.com",
			'groupId': 1
		}),
		t_links.createRow({
			'id': 2,
			'name': "Second link",
			'url': "https://www.google.com",
			'groupId': 1
		}),
		t_links.createRow({
			'id': 3,
			'name': "First link",
			'url': "https://www.google.com",
			'groupId': 2
		}),
		t_links.createRow({
			'id': 4,
			'name': "Another link",
			'url': "https://www.google.com",
			'groupId': 2
		}),
		t_links.createRow({
			'id': 5,
			'name': "Third one",
			'url': "https://www.google.com",
			'groupId': 2
		}),
		t_links.createRow({
			'id': 6,
			'name': "Soloing",
			'url': "https://www.google.com",
			'groupId': 3
		})
	]).exec();

	db.insertOrReplace().into(t_tasks).values([
		t_tasks.createRow({
			'id': 1,
			'title': "Test task",
			'done': false,
			'due': new Date(),
			'projectName': "Test project"
		}),
		t_tasks.createRow({
			'id': 2,
			'title': "Another task",
			'done': false,
			'due': new Date(),
			'projectName': "Test project"
		}),
		t_tasks.createRow({
			'id': 3,
			'title': "Third one for good measure",
			'done': false,
			'due': new Date(),
			'projectName': "Test project"
		})
	]).exec();	
}

async function syncProject() {
	const t_linkGroups = db.getSchema().table('LinkGroups');
	const t_links = db.getSchema().table('Links');
	const t_tasks = db.getSchema().table('Tasks');
	
	links.set(await db.select().from(t_linkGroups).leftOuterJoin(t_links, t_linkGroups.id.eq(t_links.groupId)).where(t_linkGroups.projectName.eq(get(activeProject))).exec());
	tasks.set(await db.select().from(t_tasks).where(t_tasks.projectName.eq(get(activeProject))).exec());
}

export const activeProject = writable();
activeProject.subscribe(val => {
	if (!val) return;
	localStorage.setItem("active", val);
	syncProject();
})

export const projects = writable();
export const links = writable([]);
export const tasks = writable([]);

export const loaded = async () => {
	try {
		db = await schemaBuilder.connect();
		
		const t_projects = db.getSchema().table('Projects');
		const t_linkGroups = db.getSchema().table('LinkGroups');
		const t_links = db.getSchema().table('Links');
		const t_tasks = db.getSchema().table('Tasks');

		await gen_test(db, t_projects, t_linkGroups, t_links, t_tasks);
		projects.set(await db.select().from(t_projects).exec());

		const active = localStorage.getItem("active");
		// Only set links and tasks if there is an active group
		active && activeProject.set(active);

		return true;
	} catch (error) {
		console.log(error);
		return error;
	}
};

