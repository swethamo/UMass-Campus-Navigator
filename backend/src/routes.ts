// routes.ts
import express, { Request, Response } from "express";
import { usersCollection, buildingsCollection } from "./database";
import { User } from "../../models/User";
import { Building } from "../../models/Building";
import { ObjectId } from "mongodb";
import { buildings_chat } from "./chat";

const router = express.Router();

router.post("/api/chat", async (req: Request, res: Response) => {
  const message = req.body.message;
  try {
    const buildings = await buildingsCollection.find<Building>({}).toArray();
    const response = await buildings_chat(message, buildings);
    res.status(200).json({ response: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to chat", error });
  }
});

router.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await usersCollection.find<User>({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

// POST a new user
router.post("/api/users", async (req: Request, res: Response) => {
  const newUser: User = req.body;

  try {
    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error });
  }
});

// PATCH a user by ID
router.patch("/api/users/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    await usersCollection.updateOne({ id: userId }, { $set: updates });
    res.status(201).json({
      message: "User updated successfully",
      userId: userId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create user", error });
  }
});

// GET a user by ID
router.get("/api/users/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await usersCollection.findOne<User>({
      id: userId,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

router.get("/api/buildings", async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const search = req.query.search as string;
  const pageSize = 6;

  try {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const buildings = await buildingsCollection.find<Building>(query).toArray();

    if (page < 1 || page > Math.ceil(buildings.length / pageSize)) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    const startIndex = (page - 1) * pageSize;
    const paginatedBuildings = buildings.slice(
      startIndex,
      startIndex + pageSize
    );

    const totalPages = Math.ceil(buildings.length / pageSize);

    res
      .status(200)
      .json({
        buildings: paginatedBuildings,
        totalPages: totalPages,
        search: search,
      });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buildings", error });
  }
});

router.get("/api/buildings/:id", async (req: Request, res: Response) => {
  const buildingId = req.params.id;

  if (!ObjectId.isValid(buildingId)) {
    return res.status(400).json({ message: "Invalid building ID" });
  }

  try {
    const building = await buildingsCollection.findOne<Building>({
      _id: new ObjectId(buildingId),
    });

    if (building) {
      res.status(200).json(building);
    } else {
      res.status(404).json({ message: "Building not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching building", error });
  }
});

export default router;
