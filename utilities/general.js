const pool = require("../model/db");

const getWebsiteSettings = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM websettings
    `);

    return rows;
  } catch (err) {
    console.error("Error fetching all website settings:", err.message);
    throw err;
  }
};


// Update website settings by fields
const updateWebsiteSettings = async (fields) => {
  try {
    // Ensure there's at least one field to update
    if (!fields || Object.keys(fields).length === 0) {
      throw new Error("No fields provided for update.");
    }

    // Build SET clause dynamically
    const setClause = Object.keys(fields)
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(fields);

    // Assuming there's only one settings row (id = 1)
    const sql = `UPDATE websettings SET ${setClause} WHERE id = 1`;

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("No website settings were updated.");
    }

    return { message: "Website settings updated successfully." };
  } catch (err) {
    console.error("Error updating website settings:", err.message);
    throw err;
  }
};

module.exports = {
  getWebsiteSettings,
  updateWebsiteSettings,
};
