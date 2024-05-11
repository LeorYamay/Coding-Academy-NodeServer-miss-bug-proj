import fs from "fs";
import { utilService } from "../../services/util.service.js";

const users = utilService.readJsonFile("./data/users.json");
const PAGE_SIZE = 4;

export const userService = {
  query,
  getById,
  save,
  remove,
  getByUsername,
};

async function query(filterBy = {}) {
  try {
    let filteredUsers = [...users];
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i");
      filteredUsers = filteredUsers.filter(
        (user) => regExp.test(user.fullname) || regExp.test(user.username)
      );
    }
    if (filterBy.isAdmin) {
      filteredUsers = filteredUsers.filter(
        (user) => user.isAdmin === filterBy.isAdmin
      );
    }
    if (filterBy.pageIdx !== undefined) {
      const firstUserIdx = Math.max(
        Math.min(filterBy.pageIdx * PAGE_SIZE, filteredUsers.length - 1),
        0
      );
      filteredUsers = filteredUsers.slice(
        firstUserIdx,
        firstUserIdx + PAGE_SIZE
      );
    }
    return filteredUsers;
  } catch (error) {
    loggerService.error(error);
    throw error;
  }
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);
    return user;
  } catch (error) {
    loggerService.error(error);
    throw error;
  }
}

async function getByUsername(username) {
  const user = users.find((user) => user.username === username);
  return user;
}

async function remove(userId) {
  try {
    const userIdx = users.findIndex((user) => user._id === userId);
    users.splice(userIdx, 1);
    _saveusersToFile();
  } catch (error) {
    loggerService.error(error);
    throw error;
  }
}

async function save(userToSave) {
  try {
    if (userToSave._id) {
      const idx = users.findIndex((user) => user._id === userToSave._id);
      if (idx < 0) throw `Cant find user with _id ${userToSave._id}`;
      users[idx] = userToSave;
    } else {
      userToSave._id = utilService.makeId();
      users.push(userToSave);
    }
    await _saveusersToFile();
    return userToSave;
  } catch (error) {
    loggerService.error(error);
    throw error;
  }
}

function _saveusersToFile(path = "./data/users.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
