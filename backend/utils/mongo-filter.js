export function buildMongoFilter(
  query,
  options = {}
) {
  const {
    searchableFields = [],
    allowedFields = [],
  } = options;

  const filter = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    // Special "query" parameter -> text search
    if (key === "query") {
      if (searchableFields.length > 0) {
        filter.$or = searchableFields.map(field => ({
          [field]: {
            $regex: value,
            $options: "i"
          }
        }));
      }

      continue;
    }

    // Only allow explicitly configured fields
    if (!allowedFields.includes(key)) {
      continue;
    }

    filter[key] = value;
  }

  return filter;
}