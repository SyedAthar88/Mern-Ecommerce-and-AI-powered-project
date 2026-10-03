export const slugify = (text) => {
    if (!text || typeof text !== "string") return "";

    return text
        .toString()
        .normalize("NFKD")                    // split accented chars (é → e + ')
        .replace(/[\u0300-\u036f]/g, "")      // remove the accent marks
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")         // remove non-alphanumeric
        .replace(/\s+/g, "-")                 // spaces → hyphens
        .replace(/-+/g, "-")                  // collapse multiple hyphens
        .replace(/^-+|-+$/g, "");             // trim leading/trailing hyphens
};

// ==========================================
// generateUniqueSlug — ensure slug is unique in a collection
// "headphones" → "headphones" (if not taken)
// "headphones" → "headphones-1" (if taken once)
// "headphones" → "headphones-2" (if taken twice)
// ==========================================
export const generateUniqueSlug = async (Model, baseText, excludeId = null) => {
    const baseSlug = slugify(baseText);

    if (!baseSlug) return "";

    let slug = baseSlug;
    let counter = 0;

    // Loop until we find a slug that isn't taken
    // excludeId lets us skip the current doc (for updates)
    while (true) {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };

        const existing = await Model.findOne(query);

        if (!existing) return slug;

        counter += 1;
        slug = `${baseSlug}-${counter}`;

        // Safety: prevent runaway loop
        if (counter > 1000) {
            throw new Error("Could not generate unique slug");
        }
    }
};