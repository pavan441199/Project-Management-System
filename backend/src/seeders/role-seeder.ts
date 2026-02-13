import "dotenv/config";
import mongoose from "mongoose";
import connectToDatabase from "../config/database-config";
import RoleModel from "../models/roles-permission-model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {

    console.log("Seeding Roles Started...")
    try {
        await connectToDatabase();
        const session = await mongoose.startSession();
        session.startTransaction();
        console.log("Clearing existing roles...")
        await RoleModel.deleteMany({}, { session });
        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];
            const existingRole = await RoleModel.findOne({ name: role }).session(session);
            if (!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions
                })
                await newRole.save({ session });
                console.log(`Created role: ${role} added with permissions..`);
            } else {
                console.log(`Role ${role} already exists, skipping...`);
            }

        }

        await session.commitTransaction();
        console.log("Seeding Roles Completed...");
        session.endSession();
        console.log("session end.")
        console.log("seeding completed")

    } catch (error) {
        console.error("Error seeding roles:", error);
    }
}

seedRoles().catch((error) => {
    console.error("Error seeding roles:", error);
})