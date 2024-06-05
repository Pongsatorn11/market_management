import { Request, Response, Router } from "express";
import multer from "multer";
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.post("/", upload.single("file"), (req: Request, res: Response) => {
  return res.status(201).json({ filePath: req.file!.path });
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const { file }: any = req.query;
    res.sendFile(await path.resolve(file));
  } catch (err) {
    return res.status(400).json({ message: "Have Something Wrong" });
  }
});

export default router;
