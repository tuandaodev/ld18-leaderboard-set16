import express, { Request, RequestHandler, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler } from "./middleware/error";
import { adminRoutes } from "./modules/admin/admin.routes";
import { logRouter } from "./modules/adminLog/log.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { campaignRoutes } from "./modules/campaign/campaign.routes";
import { contentRoutes } from "./modules/content/content.routes";
import { eventRouter } from "./modules/event/event.routes";
import { cleanUpUploadFolder } from "./modules/images/images.controller";
import { imageRouter } from "./modules/images/images.routes";
import { leaderBoardRouter } from "./modules/leaderBoard/leader-board.routes";
import { checkCronDate, processMatchesForLeaderboard } from "./modules/leaderBoard/leader-board.controller";

const cors = require("cors");
const cron = require('node-cron');
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const { xss } = require('express-xss-sanitizer');

export const app = express();
app.use(i18nextMiddleware.handle(i18next));

// API Rate Limit
const apiRateLimiter = rateLimit({
  windowMs: Number(15 * 60 * 1000),
  max: Number(2000),
  standardHeaders: true,
  legacyHeaders: false,
});

// Create/Update API Rate Limit
const createApiRateLimiter = rateLimit({
  windowMs: Number(60 * 1000),
  max: Number(30),
  standardHeaders: true,
  legacyHeaders: false,
});

const limitCreateRoutes: RequestHandler = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE") {
    return createApiRateLimiter(req, res, next);
  }

  return next();
};

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json'
        },
        fallbackLng: 'en',
        preload: ['en', 'vi']
    });

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID!,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
// },
//   async (accessToken, refreshToken, profile, cb) => {

//   try {
//     // Find the user in the database based on their Google ID
//     let user = await User.findOneBy({ sourceId: profile.id, source: UserSource.GOOGLE });
//     if (!user) {
//       const email = profile?.emails?.[0].value;
//       if (!email) {
//         return cb(new Error("No email found"), undefined);
//       }

//       user = await addUser(email, email, 
//         profile.displayName, profile.photos?.[0].value ?? "", 
//         UserSource.GOOGLE, profile.id, UserRole.USER);
//     }

//     // Return the user object
//     return cb(null, user);
//   } catch (err) {
//     // Handle any errors that occur during the process
//     return cb(err, undefined);
//   }
// }
// ));

// passport.use(new LocalStrategy((username, password, cb) => {
//   // Perform user lookup or verification here
//   // and return the user object
//   const user = { id: 1, username: 'user', password: 'password' };
//   if (username !== user.username || password !== user.password) {
//     return cb(null, false);
//   }
//   return cb(null, user);
// }));

// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID!,
//   clientSecret: process.env.FACEBOOK_APP_SECRET!,
//   callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
//   profileFields: ['id', 'displayName', 'photos', 'email']
// }, async (accessToken, refreshToken, profile, cb) => {

//   try {
//     // Find the user in the database based on their Google ID
//     let user = await User.findOneBy({ sourceId: profile.id, source: UserSource.FACEBOOK });
//     if (!user) {
//       let email = profile?.emails?.[0].value ?? "";
//       let userName = profile?.emails?.[0].value ?? profile.id;

//       user = await addUser(userName, email, 
//         profile.displayName, profile.photos?.[0].value ?? "", 
//         UserSource.FACEBOOK, profile.id, UserRole.USER);
//     }

//     // Return the user object
//     return cb(null, user);
//   } catch (err) {
//     // Handle any errors that occur during the process
//     return cb(err, undefined);
//   }
// }));

// passport.use(new TiktokStrategy({
//   clientID: process.env.TIKTOK_APP_ID,
//   clientSecret: process.env.TIKTOK_APP_SECRET,
//   scope: ['user.info.basic'],
//   callbackURL: "https://localhost:3000/auth/tiktok/callback"
// },
// async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
//   try {
//     console.log(profile);
//     // Find the user in the database based on their Google ID
//     let user = await User.findOneBy({ sourceId: profile.id, source: UserSource.FACEBOOK });
//     if (!user) {
//       let email = profile?.emails?.[0].value ?? "";
//       let userName = profile?.emails?.[0].value ?? profile.id;

//       user = await addUser(userName, email, 
//         profile.displayName, profile.photos?.[0].value ?? "", 
//         UserSource.TIKTOK, profile.id, UserRole.USER);
//       // console.log(user);
//     }

//     // Return the user object
//     return cb(null, user);
//   } catch (err) {
//     // Handle any errors that occur during the process
//     return cb(err, undefined);
//   }
// }
// ));

app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
} else {
  app.use(helmet());
}

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(xss());
app.use(limitCreateRoutes);
app.use(apiRateLimiter);

// Mount routes
app.use("/auth", authRouter);
app.use("/admin", adminRoutes);
app.use("/log", logRouter);
// app.use("/community-events", communityEventRouter);
// app.use("/partner-gaming-centers", partnerGamingCenterRouter);
app.use("/events", eventRouter);
app.use("/images", imageRouter);
app.use("/contents", contentRoutes);
app.use("/campaigns", campaignRoutes);
// app.use("/location", locationRoutes);
// app.use("/notifications", notificationRouter);
// app.use("/leaders", leaderRouter);
app.use("/leader-board", leaderBoardRouter);

app.get("/health", async (_: Request, res: Response) => {
  try {
    res.status(200).json({
      uptime: process.uptime()
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/health/live", (_: Request, res: Response) => {
  res.status(200).json({});
});

app.get("/", (_: Request, res: Response) => {
  res.send("200");
});

// Define routes
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { session: false }),
//   (req, res) => {
//     // Successful authentication, issue JWT
//     const user = req.user;
//     if (!user) {
//       return res.status(401).json({ message: "Invalid user" });
//     }
//     let userDto = new BaseUserDto();
//     userDto.init(user as User);
//     const response = {
//       success: 200,
//       access_token: genAC({ ...userDto }),
//       refresh_token: genRF({ ...userDto }),
//       role: userDto.role,
//       roleString: userDto.role === UserRole.ADMIN ? "ADMIN" : "USER",
//   };

//   // Redirect the popup to a specific URL on your client-side application with the data as query parameters
//   const redirectUrl = `${process.env.FRONTEND_URL}/popup.html?access_token=${response.access_token}&refresh_token=${response.refresh_token}&role=${response.role}&roleString=${response.roleString}`;
//   res.redirect(redirectUrl);
//   }
// );

// app.get('/auth/facebook', passport.authenticate('facebook', {
//   scope: ['email', 'public_profile']
// }));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { session: false }),
//   (req, res) => {
//     // Successful authentication, issue JWT
//     const user = req.user;
//     if (!user) {
//       return res.status(401).json({ message: "Invalid user" });
//     }
//     let userDto = new AdminDto();
//     userDto.init(user as User);
//     const response = {
//       success: 200,
//       access_token: genAC({ ...userDto }),
//       refresh_token: genRF({ ...userDto }),
//       role: userDto.role,
//       roleString: userDto.role === UserRole.ADMIN ? "ADMIN" : "USER",
//     };

//     // Redirect the popup to a specific URL on your client-side application with the data as query parameters
//     const redirectUrl = `${process.env.FRONTEND_URL}/popup.html?access_token=${response.access_token}&refresh_token=${response.refresh_token}&role=${response.role}&roleString=${response.roleString}`;
//     res.redirect(redirectUrl);
//   }
// );

// app.get('/auth/tiktok',
//   passport.authenticate('tiktok')
// );

// app.get('/auth/tiktok/callback', 
//   passport.authenticate('tiktok', { session: false }),
//   function(req, res) {
//     // Successful authentication, issue JWT
//     const user = req.user;
//     if (!user) {
//       return res.status(401).json({ message: "Invalid user" });
//     }
//     let userDto = new AdminDto();
//     userDto.init(user as User);
//     const response = {
//       success: 200,
//       access_token: genAC({ ...userDto }),
//       refresh_token: genRF({ ...userDto }),
//       role: userDto.role,
//       roleString: userDto.role === UserRole.ADMIN ? "ADMIN" : "USER",
//     };

//     // Redirect the popup to a specific URL on your client-side application with the data as query parameters
//     const redirectUrl = `${process.env.FRONTEND_URL}/popup.html?access_token=${response.access_token}&refresh_token=${response.refresh_token}&role=${response.role}&roleString=${response.roleString}`;
//     res.redirect(redirectUrl);
//   }
// );

app.use(errorHandler);

// const processCron = async () => {
//   console.log('Processing cron');
// }
// cron.schedule('* */2 * * *', processCron);

const processCleanUpTempFiles = async () => {
  await cleanUpUploadFolder();
}

cron.schedule('01 2 * * *', processCleanUpTempFiles);

let isRefreshingMatches = false;
const procesRefreshingMatches = async () => {
  if (isRefreshingMatches) {
    return;
  }

  if (!checkCronDate()) {
    console.log("Cron date is not valid, skipping procesRefreshingMatches");
    return;
  }

  isRefreshingMatches = true;
  try {
    await processMatchesForLeaderboard(20, true);
  } catch (error: any) {
    console.error('Error processing matches:', error.message);
  } finally {
    isRefreshingMatches = false;
  }
}
// Schedule to run every 5 minutes from 12:00 to 23:59 (time check handles 23:30 cutoff)
cron.schedule('*/5 12-23 * * *', procesRefreshingMatches);



let isCalculatingMatches = false;
const procesCalculatingMatches = async () => {
  if (isCalculatingMatches) {
    return;
  }

  if (!checkCronDate()) {
    console.log("Cron date is not valid, skipping procesCalculatingMatches");
    return;
  }

  isCalculatingMatches = true;
  try {
    await processMatchesForLeaderboard(20);
  } catch (error: any) {
    console.error('Error processing matches:', error.message);
  } finally {
    isCalculatingMatches = false;
  }
}
// Schedule to run every 5 minutes from 00:00 to 11:59
cron.schedule('*/5 0-11 * * *', procesCalculatingMatches);

export default app;
