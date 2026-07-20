INSERT INTO "Category" ("name", "slug", "createdAt", "updatedAt")
VALUES ('Calçados', 'calcados', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO UPDATE
SET "name" = EXCLUDED."name",
    "updatedAt" = CURRENT_TIMESTAMP;
