"use server";

import { cookies } from "next/headers";

/**
 * Validates the admin password and sets an HTTP-only session cookie.
 */
export async function loginAdmin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || "samadhan123";
  
  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day session
      path: "/",
    });
    return { success: true };
  }
  
  return { success: false, error: "Invalid admin password credentials" };
}

/**
 * Deletes the admin session cookie to log out.
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Updates a project's live deployment URL.
 */
export async function updateProjectUrl(projectName: string, url: string) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  if (!isAdmin) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    await db.updateProjectLiveUrl(projectName, url);
    revalidatePath("/admin-dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message || "Failed to update project URL" };
  }
}

import { type Project } from "@/data/projects";

/**
 * Adds a new project to the portfolio (manual or imported).
 */
export async function addProjectAction(project: Project) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  if (!isAdmin) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    await db.addProject(project);
    revalidatePath("/admin-dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message || "Failed to add project" };
  }
}

/**
 * Deletes a project by name/slug.
 */
export async function deleteProjectAction(projectName: string) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  if (!isAdmin) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    await db.deleteProject(projectName);
    revalidatePath("/admin-dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message || "Failed to delete project" };
  }
}

/**
 * Updates specific fields of a project.
 */
export async function updateProjectAction(projectName: string, updatedFields: Partial<Project>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "true";
  if (!isAdmin) {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    await db.updateProject(projectName, updatedFields);
    revalidatePath("/admin-dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message || "Failed to update project" };
  }
}
