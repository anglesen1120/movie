import { Router } from "express";

// Import Controllers
import commentsRouter from "./controllers/comments.controller";
import moviesRouter from "./controllers/movies.controller";

const router: Router = Router();

router.use("/movies", moviesRouter);
router.use("/comments", commentsRouter);

export default router;
