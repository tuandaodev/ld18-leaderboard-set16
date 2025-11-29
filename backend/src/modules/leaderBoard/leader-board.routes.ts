import { Router } from "express";
import { exportLeaderBoardCSV, getLeaderBoardList, initUsersLeaderBoard, testController, uploadCSV } from "./leader-board.controller";

export const leaderBoardRouter = Router();

leaderBoardRouter.get("/list", getLeaderBoardList);
leaderBoardRouter.get("/init-user", initUsersLeaderBoard);
leaderBoardRouter.post("/export-leaderboard", exportLeaderBoardCSV);

leaderBoardRouter.get("/test", testController);

leaderBoardRouter.post('/upload-data', uploadCSV as any);