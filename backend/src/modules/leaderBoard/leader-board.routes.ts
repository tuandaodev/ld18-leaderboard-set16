import { Router } from "express";
import { exportLeaderBoardCSV, getLeaderBoardList, processMatchesController, processUsersController, uploadLeaderboardConfigController } from "./leader-board.controller";

export const leaderBoardRouter = Router();

leaderBoardRouter.get("/list", getLeaderBoardList);
// initUsersLeaderBoard and exportLeaderBoardCSV are now arrays of middleware
leaderBoardRouter.post("/process-matches", processMatchesController as any);

leaderBoardRouter.post("/process-users", processUsersController);

leaderBoardRouter.post("/export-leaderboard", exportLeaderBoardCSV as any);

// leaderBoardRouter.get("/test", testController);

leaderBoardRouter.post('/upload-data', uploadLeaderboardConfigController as any);