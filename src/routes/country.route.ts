import { Router } from "express";
import {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  getAllCurrenciesHandler,
  getAllLanguagesHandler,
  assignCountryLanguage,
} from "../controllers/country.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", getAllCountries);
// router.get("/:id", asyncHandler(getCountryById));
router.post("/", asyncHandler(createCountry));
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);
router.get("/currencies", asyncHandler(getAllCurrenciesHandler));
router.get("/languages", asyncHandler(getAllLanguagesHandler));
router.post("/country-languages", asyncHandler(assignCountryLanguage));

export default router;
