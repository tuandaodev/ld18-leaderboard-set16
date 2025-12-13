import { Router } from "express";
import { exportLeaderBoardCSV, getLeaderBoardList, initUserList, processUsersLeaderBoard, uploadCSV } from "./leader-board.controller";

export const leaderBoardRouter = Router();

leaderBoardRouter.get("/list", getLeaderBoardList);
// initUsersLeaderBoard and exportLeaderBoardCSV are now arrays of middleware
leaderBoardRouter.get("/process-user-leaderboard", processUsersLeaderBoard as any);

leaderBoardRouter.get("/process-user-list", initUserList);

leaderBoardRouter.post("/export-leaderboard", exportLeaderBoardCSV as any);

// leaderBoardRouter.get("/test", testController);

leaderBoardRouter.post('/upload-data', uploadCSV as any);