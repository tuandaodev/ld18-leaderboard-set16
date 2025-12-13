import { Router } from "express";
import { exportLeaderBoardCSV, getLeaderBoardList, getProcessStatusController, processMatchesController, processUsersController, saveMatchesController, uploadLeaderboardConfigController } from "./leader-board.controller";

export const leaderBoardRouter = Router();

leaderBoardRouter.get("/list", getLeaderBoardList);

leaderBoardRouter.get("/status", getProcessStatusController);

// initUsersLeaderBoard and exportLeaderBoardCSV are now arrays of middleware
leaderBoardRouter.post("/process-matches", processMatchesController as any);

leaderBoardRouter.post("/process-users", processUsersController);

leaderBoardRouter.post("/export-leaderboard", exportLeaderBoardCSV as any);

// leaderBoardRouter.get("/test", testController);

leaderBoardRouter.post('/upload-data', uploadLeaderboardConfigController as any);

leaderBoardRouter.post('/init-cached-matches', saveMatchesController);