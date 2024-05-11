import { userService } from "./user.service.js";

export async function getUser(req, res) {
  try {
    const userId = req.params.userId;
    const user = await userService.getById(userId);
    res.send(user);
  } catch (error) {
    res.status(400).send("could not get user");
  }
}

export async function getUsers(req, res) {
  try {
    const {
      txt,
      isAdmin      
    } = req.body;
    const filterBy = {
      txt,
      isAdmin
    };
    const users = await userService.query(filterBy);
    res.send(users);
  } catch {
    res.status(400).send("could not get users");
  }
}

export async function updateUser(req, res) {
  const user = { ...req.body };
  try {
    let userToSave = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      imgUrl: user.imgUrl,
      isAdmin: +user.isAdmin
    };
    await userService.save(userToSave);
    res.send(userToSave);
  } catch (error) {
    res.status(400).send(`could not save user ${user._id}`);
  }
}
export async function addUser(req, res) {
  const user = { ...req.body };
  try {
    let userToSave = {
      title: user.title,
      fullname: user.fullname,
      username: user.username,
      imgUrl: user.imgUrl,
      isAdmin: +user.isAdmin,
      createdAt: Date.now()
    };
    await userService.save(userToSave);
    res.send(userToSave);
  } catch (error) {
    res.status(400).send("could not save user");
  }
}

export async function removeUser(req, res) {
  try {
    const userId = req.params.userId;
    await userService.remove(userId);
    res.send("deleted");
  } catch (error) {
    res.status(400).send("could not remove user");
  }
}

