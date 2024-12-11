// database.ts
import { MongoClient, Db, Collection } from "mongodb";
import { User } from "../../models/User";
import { Building } from "../../models/Building";
import { environment } from "../environment";

let db: Db;

export let usersCollection: Collection<User>;
export let buildingsCollection: Collection<Building>;

export const connectDB = async () => {
  const client = new MongoClient(environment.mongoKey);
  await client.connect();
  db = client.db("campus_navigator");

  usersCollection = db.collection<User>("users");
  buildingsCollection = db.collection<Building>("buildings");
};
