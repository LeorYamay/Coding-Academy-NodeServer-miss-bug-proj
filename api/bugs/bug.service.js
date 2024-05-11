import fs from "fs";
import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";

const bugs = utilService.readJsonFile("./data/bugs.json");
const PAGE_SIZE = 4;

export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query(filterBy = {}) {
  try {
    let filteredBugs = [...bugs];
    console.log(filterBy)
    if (filterBy.createdAfter) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.createdAt > filterBy.createdAfter
      );
    }
    if (filterBy.createdBefore) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.createdAt < filterBy.createdBefore
      );
    }
    if (filterBy.maxSeverity) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.severity <= filterBy.maxSeverity
      );
    }
    if (filterBy.minSeverity) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.severity >= filterBy.minSeverity
      );
    }
    if (filterBy.txt) {
      const regExpTxt = new RegExp(filterBy.txt, "i");
      filteredBugs = filteredBugs.filter(
        (bug) => regExpTxt.test(bug.title) || regExpTxt.test(bug.description)
      );
    }
    if (filterBy.createdById) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.creator._id === filterBy.createdById
      );
    }
    if (filterBy.createdByFullname) {
      const regExpCreatorName = new RegExp(filterBy.createdByFullname, "i");
      filteredBugs = filteredBugs.filter((bug) =>
        regExpCreatorName.test(bug.creator.fullname)
      );
    }
    if (filterBy.pageIdx) {
      const firstBugIdx = Math.max(
        Math.min(filterBy.pageIdx * PAGE_SIZE, filteredBugs.length - 1),
        0
      );
      filteredBugs = filteredBugs.slice(firstBugIdx, firstBugIdx + PAGE_SIZE);
    }

    return filteredBugs;
  } catch (error) {
    loggerService.error(error);
    throw error;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    return bug;
  } catch (error) {
    loggerService.error(error);
    throw error;
  }
}

async function remove(bugId) {
  try {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId);
    bugs.splice(bugIdx, 1);
    _saveBugsToFile();
  } catch (error) {
    loggerService.error(error);
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
    loggerService.error(error);
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
