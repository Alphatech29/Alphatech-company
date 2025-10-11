const pool = require("../model/db");

async function getPortfolioData() {
  try {
    // Get all records from portfolio table
    const [rows] = await pool.query("SELECT * FROM portfolio ORDER BY date_completed DESC");

    return {
      success: true,
      message: "Portfolio data retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}

async function insertPortfolio(portfolio) {
  const {
    title,
    description,
    category,
    owner,
    start_date,
    amount,
    image_url,
    project_url,
    date_completed,
  } = portfolio;

  try {
    const [result] = await pool.query(
      `INSERT INTO portfolio
      (title, description, category, owner, start_date, amount, image_url, project_url, date_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        category || null,
        owner || null,
        start_date || null,
        amount || null,
        image_url || null,
        project_url || null,
        date_completed || null,
      ]
    );

    return {
      success: true,
      message: "Portfolio record inserted successfully",
      insertId: result.insertId,
    };
  } catch (error) {
    console.error("Error inserting portfolio data:", error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}


module.exports = {getPortfolioData, insertPortfolio};
