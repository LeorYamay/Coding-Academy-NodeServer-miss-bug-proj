import { authService } from "../api/auth/auth.service.js"; 

export function requireUser(req, res, next) {
  const loggedInUser = authService.validateToken(req.cookies.loginToken);
  if (!loggedInUser) return res.status(401).send("Authentication issue");
  req.loggedInUser = loggedInUser;
  next();
}

export function requireAdmin(req, res, next) {
  const loggedInUser = authService.validateToken(req.cookies.loginToken);
  if (!loggedInUser) return res.status(401).send("Authentication issue");
  if (!loggedInUser.isAdmin) {
    console.warn(`${loggedInUser.username} tried to perform admin action`);
    return res.status(403).send("not authorized to perform action");
  }
  req.loggedInUser = loggedInUser;
  next();
}
