import { Router } from "express";
import { submitContact } from "./contact.controller";
import { validate } from "../middleware/validate";
import { z } from "zod";

const router = Router();
const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    message: z.string().min(10),
});
router.post("/", validate(contactSchema), submitContact);

export default router;