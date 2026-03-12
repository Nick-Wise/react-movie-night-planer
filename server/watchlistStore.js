import { createClient } from "@supabase/supabase-js";

function assertConfig(config) {
  if (!config.supabaseUrl) {
    throw new Error("Missing SUPABASE_URL environment variable.");
  }

  if (!config.supabaseServiceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
  }
}

export function createSupabaseWatchlistStore(config) {
  assertConfig(config);

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const table = config.supabaseWatchlistTable;

  async function getByExternalId(externalId) {
    const { data, error } = await supabase.from(table).select("*").eq("external_id", externalId).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  return {
    async list() {
      const { data, error } = await supabase.from(table).select("*").order("added_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data ?? [];
    },

    async create(movie) {
      const row = {
        external_id: movie.externalId,
        title: movie.title,
        year: movie.year,
        poster_url: movie.posterUrl,
        genre: movie.genre,
        description: movie.description,
        runtime_minutes: movie.runtimeMinutes,
        streaming_service: movie.streamingService,
        priority: movie.priority,
        planned_date: movie.plannedDate,
        status: "want",
        user_rating: null,
        notes: "",
        added_at: new Date().toISOString(),
      };

      const { data, error } = await supabase.from(table).insert(row).select("*").single();

      if (!error) {
        return { row: data, created: true };
      }

      if (error.code === "23505") {
        const existing = await getByExternalId(movie.externalId);
        return { row: existing, created: false };
      }

      throw error;
    },

    async update(externalId, patch) {
      const existing = await getByExternalId(externalId);

      if (!existing) {
        return null;
      }

      const nextRow = {
        status: patch.status ?? existing.status,
        user_rating: Object.prototype.hasOwnProperty.call(patch, "userRating") ? patch.userRating : existing.user_rating,
        notes: Object.prototype.hasOwnProperty.call(patch, "notes") ? patch.notes : existing.notes,
        priority: patch.priority ?? existing.priority,
        planned_date: Object.prototype.hasOwnProperty.call(patch, "plannedDate")
          ? patch.plannedDate
          : existing.planned_date,
        streaming_service: Object.prototype.hasOwnProperty.call(patch, "streamingService")
          ? patch.streamingService
          : existing.streaming_service,
      };

      const { data, error } = await supabase
        .from(table)
        .update(nextRow)
        .eq("external_id", externalId)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    async remove(externalId) {
      const { error, count } = await supabase.from(table).delete({ count: "exact" }).eq("external_id", externalId);

      if (error) {
        throw error;
      }

      return { deleted: (count ?? 0) > 0 };
    },
  };
}
