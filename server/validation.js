const WATCHLIST_STATUSES = new Set(["want", "watching", "watched"]);
const WATCHLIST_PRIORITIES = new Set(["low", "medium", "high"]);

function asOptionalTrimmedString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function validateCreateWatchlistPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { error: "Request body must be an object." };
  }

  const externalId = asOptionalTrimmedString(payload.externalId);
  const title = asOptionalTrimmedString(payload.title);

  if (!externalId || !title) {
    return { error: "externalId and title are required." };
  }

  const year = payload.year === null || payload.year === undefined ? null : Number(payload.year);
  if (year !== null && (!Number.isInteger(year) || year < 1888 || year > 2100)) {
    return { error: "year must be a valid movie year." };
  }

  const runtimeMinutes =
    payload.runtimeMinutes === null || payload.runtimeMinutes === undefined ? null : Number(payload.runtimeMinutes);
  if (runtimeMinutes !== null && (!Number.isInteger(runtimeMinutes) || runtimeMinutes <= 0 || runtimeMinutes > 600)) {
    return { error: "runtimeMinutes must be a whole number between 1 and 600." };
  }

  const priority = payload.priority === undefined || payload.priority === null ? "medium" : String(payload.priority);
  if (!WATCHLIST_PRIORITIES.has(priority)) {
    return { error: "priority must be low, medium, or high." };
  }

  const plannedDate = asOptionalTrimmedString(payload.plannedDate);
  if (plannedDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(plannedDate)) {
    return { error: "plannedDate must use YYYY-MM-DD format." };
  }

  return {
    value: {
      externalId,
      title,
      year,
      posterUrl: asOptionalTrimmedString(payload.posterUrl),
      genre: asOptionalTrimmedString(payload.genre),
      description: asOptionalTrimmedString(payload.description),
      runtimeMinutes,
      streamingService: asOptionalTrimmedString(payload.streamingService),
      priority,
      plannedDate,
    },
  };
}

export function validateWatchlistPatch(payload) {
  if (!payload || typeof payload !== "object") {
    return { error: "Request body must be an object." };
  }

  const patch = {};

  if ("status" in payload) {
    if (!WATCHLIST_STATUSES.has(payload.status)) {
      return { error: "status must be want, watching, or watched." };
    }
    patch.status = payload.status;
  }

  if ("userRating" in payload) {
    const userRating = payload.userRating;
    if (userRating !== null && (!Number.isFinite(Number(userRating)) || Number(userRating) < 1 || Number(userRating) > 5)) {
      return { error: "userRating must be between 1 and 5." };
    }
    patch.userRating = userRating === null ? null : Number(userRating);
  }

  if ("notes" in payload) {
    if (typeof payload.notes !== "string") {
      return { error: "notes must be a string." };
    }
    patch.notes = payload.notes.trim();
  }

  if ("priority" in payload) {
    if (!WATCHLIST_PRIORITIES.has(payload.priority)) {
      return { error: "priority must be low, medium, or high." };
    }
    patch.priority = payload.priority;
  }

  if ("plannedDate" in payload) {
    if (
      payload.plannedDate !== null &&
      payload.plannedDate !== "" &&
      !/^\d{4}-\d{2}-\d{2}$/.test(String(payload.plannedDate))
    ) {
      return { error: "plannedDate must use YYYY-MM-DD format." };
    }
    patch.plannedDate = payload.plannedDate ? String(payload.plannedDate) : null;
  }

  if ("streamingService" in payload) {
    if (payload.streamingService !== null && typeof payload.streamingService !== "string") {
      return { error: "streamingService must be a string." };
    }
    patch.streamingService = payload.streamingService ? payload.streamingService.trim() : null;
  }

  return { value: patch };
}
