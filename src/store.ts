import type { SvelteComponent } from "svelte";
import type { Project } from "./database/database";
import { writable } from "svelte/store";
import lf from "lovefield";

const schemabuilder = lf.schema.create("workpage", 1);

export const modal = writable<typeof SvelteComponent>();
export const project = writable<Project>(JSON.parse(localStorage.getItem("project")));
export const db = writable<lf.Database>();

project.subscribe(val => {
    localStorage.setItem("project", JSON.stringify(val));
})

export const load = async function () {
    schemabuilder
        .createTable("Projects")
        .addColumn("id", lf.Type.INTEGER)
        .addColumn("name", lf.Type.STRING)
        .addColumn("used", lf.Type.DATE_TIME)
        .addPrimaryKey(["id"], true);

    schemabuilder
        .createTable("LinkGroups")
        .addColumn("id", lf.Type.INTEGER)
        .addColumn("name", lf.Type.STRING)
        .addColumn("projectId", lf.Type.INTEGER)
        .addPrimaryKey(["id"], true)
        .addForeignKey("fk_Project", {
            local: "projectId",
            ref: "Projects.id",
            action: lf.ConstraintAction.CASCADE,
        });

    schemabuilder
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

    schemabuilder
        .createTable("Tasks")
        .addColumn("id", lf.Type.INTEGER)
        .addColumn("name", lf.Type.STRING)
        .addColumn("done", lf.Type.BOOLEAN)
        .addColumn("due", lf.Type.DATE_TIME)
        .addColumn("projectId", lf.Type.INTEGER)
        .addNullable(["due"])
        .addPrimaryKey(["id"], true)
        .addForeignKey("fk_Project", {
            local: "projectId",
            ref: "Projects.id",
            action: lf.ConstraintAction.CASCADE,
        });

    db.set(await schemabuilder.connect());
    
    return true;
};