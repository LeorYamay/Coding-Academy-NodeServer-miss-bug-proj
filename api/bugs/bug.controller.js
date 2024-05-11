import { bugService } from "./bug.service.js";

export async function getBugs(req, res) {
  try {
    const {
      txt,
      description,
      maxSeverity,
      minSeverity,
      createdBefore,
      createdAfter,
      pageIdx,
      sortBy,
      createdById,
      createdByFullname,
    } = req.body;
    const filterBy = {
      txt,
      description,
      minSeverity: +minSeverity,
      maxSeverity: +maxSeverity,
      createdBefore,
      createdAfter,
      pageIdx: +pageIdx,
      createdById,
      createdByFullname,
    };
    const bugs = await bugService.query(filterBy);
    res.send(bugs);
  } catch {
    res.status(400).send("could not get bugs");
  }
}

export async function updateBug(req, res) {
  const bug = { ...req.body };
  try {
    let bugToSave = {
      _id: bug._id,
      title: bug.title,
      description: bug.description,
      severity: +bug.severity,
    };
    await bugService.save(bugToSave);
    res.send(bugToSave);
  } catch (error) {
    res.status(400).send(`could not save bug ${bug._id}`);
  }
}
export async function addBug(req, res) {
  const bug = { ...req.body };
  try {
    let bugToSave = {
      title: bug.title,
      description: bug.description,
      severity: +bug.severity,
      createdAt: Date.now(),
    };
    await bugService.save(bugToSave);
    res.send(bugToSave);
  } catch (error) {
    res.status(400).send("could not save bug");
  }
}

export async function getBug(req, res) {
  try {
    const bugId = req.params.bugId;
    let bugLimiter = req.cookies.bugLimiter;
    bugLimiter = updateVisitedBugs(bugId, bugLimiter);
    res.cookie("bugLimiter", bugLimiter);
    const bug = await bugService.getById(bugId);
    res.send(bug);
  } catch (error) {
    if (error.message === "bugLimit Reached") {
      res.status(401).send("Wait for a bit");
    } else {
      res.status(400).send("could not get bug");
    }
  }
}

export async function removeBug(req, res) {
  try {
    const bugId = req.params.bugId;
    await bugService.remove(bugId);
    res.send("deleted");
  } catch (error) {
    res.status(400).send("could not remove bug");
  }
}

const updateVisitedBugs = (bugId, bugLimiter) => {
  const timeout = "7 seconds";
  if (!bugLimiter) {
    bugLimiter = {
      visitedBugs: [],
      lastVisit: Date.now(),
    };
  }
  if (!bugLimiter.visitedBugs.includes(bugId)) {
    if (bugLimiter.visitedBugs.length < 3) {
      bugLimiter.visitedBugs.push(bugId);

      if (bugLimiter.visitedBugs.length === 3) {
        bugLimiter.lastVisit = Date.now();
      }
    } else {
      if (Date.now() - bugLimiter.lastVisit > ms(timeout)) {
        bugLimiter.visitedBugs = [bugId];
      } else {
        throw new Error("bugLimit Reached");
      }
    }
  }
  loggerService.info(
    `User visited at the following bugs:${bugLimiter.visitedBugs} within the past ${timeout}`
  );
  return bugLimiter;
};
