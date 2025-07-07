import { Request, Response } from "express";
import { db } from "../db/connection";
import {
  countries,
  currencies,
  languages,
  countryLanguages,
} from "../models/country.model";
import { eq } from "drizzle-orm";

export const getAllCountries = async (req: Request, res: Response) => {
  try {
    // Fetch all countries with their currency and languages
    const countryRows = await db.select().from(countries);
    const result = await Promise.all(
      countryRows.map(async (country) => {
        const currency = await db
          .select()
          .from(currencies)
          .where(eq(currencies.id, country.currencyId));
        const langLinks = await db
          .select()
          .from(countryLanguages)
          .where(eq(countryLanguages.countryId, country.id));
        const langs = await Promise.all(
          langLinks.map(async (cl) => {
            const lang = await db
              .select()
              .from(languages)
              .where(eq(languages.id, cl.languageId));
            return lang[0];
          })
        );
        return {
          ...country,
          currency: currency[0],
          languages: langs,
        };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
};

export const getCountryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const countryRows = await db
      .select()
      .from(countries)
      .where(eq(countries.id, id));
    if (!countryRows.length)
      return res.status(404).json({ error: "Country not found" });
    const country = countryRows[0];
    const currency = await db
      .select()
      .from(currencies)
      .where(eq(currencies.id, country.currencyId));
    const langLinks = await db
      .select()
      .from(countryLanguages)
      .where(eq(countryLanguages.countryId, country.id));
    const langs = await Promise.all(
      langLinks.map(async (cl) => {
        const lang = await db
          .select()
          .from(languages)
          .where(eq(languages.id, cl.languageId));
        return lang[0];
      })
    );
    res.status(200).json({
      data: {
        ...country,
        currency: currency[0],
        languages: langs,
      },
      status: true,
      message: "Country fetched",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch country" });
  }
};

export const createCountry = async (req: Request, res: Response) => {
  try {
    const { name, flagUrl, currencyId, languageIds, status } = req.body;
    if (
      !name ||
      !currencyId ||
      !Array.isArray(languageIds) ||
      languageIds.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Insert country
    const [insertedId] = await db
      .insert(countries)
      .values({ name, flagUrl, currencyId, status })
      .$returningId();

    const [country] = await db
      .select()
      .from(countries)
      .where(eq(countries.id, Number(insertedId)))
      .limit(1);
    // Insert country_languages
    await Promise.all(
      languageIds.map((languageId: number) =>
        db
          .insert(countryLanguages)
          .values({ countryId: country.id, languageId, status: "active" })
      )
    );
    res.status(201).json({ ...country, languageIds });
  } catch (err) {
    res.status(500).json({ error: "Failed to create country" });
  }
};

export const updateCountry = async (req: Request, res: Response) => {
  // TODO: Implement update with currency and languages
  res.json({});
};

export const deleteCountry = async (req: Request, res: Response) => {
  // TODO: Implement delete
  res.status(204).send();
};
