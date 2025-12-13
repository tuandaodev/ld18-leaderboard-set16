import { Router } from "express";
import { exportLeaderBoardCSV, getLeaderBoardList, processMatchesController, processUsersController, uploadLeaderboardConfigController } from "./leader-board.controller";

export const leaderBoardRouter = Router();

leaderBoardRouter.get("/list", getLeaderBoardList);
// initUsersLeaderBoard and exportLeaderBoardCSV are now arrays of middleware
leaderBoardRouter.get("/process-matches", processMatchesController as any);

leaderBoardRouter.get("/process-users", processUsersController);

leaderBoardRouter.post("/export-leaderboard", exportLeaderBoardCSV as any);

// leaderBoardRouter.get("/test", testController);

leaderBoardRouter.post('/upload-data', uploadLeaderboardConfigController as any);