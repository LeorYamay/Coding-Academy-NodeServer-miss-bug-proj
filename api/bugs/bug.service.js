import fs from "fs";
import { utilService } from "../../services/util.service.js";

const bugs = utilService.readJsonFile("./data/bugs.json");

export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query(filterBy = {}) {
  const bugsPerPage = 4;
  try {
    let filteredbugs = [...bugs];
    if (filterBy.createdAfter) {
      filteredbugs = filteredbugs.filter(
        (bug) => bug.createdAt > filterBy.createdAfter
      );
    }
    if (filterBy.createdBefore) {
      filteredbugs = filteredbugs.filter(
        (bug) => bug.createdAt < filterBy.createdBefore
      );
    }
    if (filterBy.maxSeverity) {
      filteredbugs = filteredbugs.filter(
        (bug) => bug.severity <= filterBy.maxSeverity
      );
    }
    if (filterBy.minSeverity) {
      filteredbugs = filteredbugs.filter(
        (bug) => bug.severity >= filterBy.minSeverity
      );
    }
    if (filterBy.txt) {
      const regExp = new RegExp(filterBy.txt, "i");
      filteredbugs = filteredbugs.filter(
        (bug) => regExp.test(bug.title) || regExp.test(bug.description)
      );
    }
    let firstBugIdx = filterBy.pageIdx
      ? Math.max(
          Math.min(filterBy.pageIdx * bugsPerPage, filteredbugs.length - 1),
          0
        )
      : 0;
    console.log("filteredbugs.length", filteredbugs.length);
    filteredbugs = filteredbugs.slice(firstBugIdx, firstBugIdx + bugsPerPage);
    console.log("filteredbugs.length", filteredbugs.length);
    console.log("firstBugIdx", firstBugIdx);
    return filteredbugs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    return bug;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId);
    bugs.splice(bugIdx, 1);
    _saveBugsToFile();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx < 0) throw `Cant find bug with _id ${bugToSave._id}`;
      bugs[idx] = bugToSave;
    } else {
      bugToSave._id = utilService.makeId();
      bugs.push(bugToSave);
    }
    await _saveBugsToFile();
    return bugToSave;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function _saveBugsToFile(path = "./data/bugs.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
