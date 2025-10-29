const pool = require("../model/db");

async function insertConsultationBooking(booking) {
  const {
    full_name,
    email,
    company,
    role,
    phone,
    whatsapp,
    country,
    location,
    address,
    mode,
    date,
    time,
    duration,
    cost,
    reference_websites,
    project_details,
    status,
  } = booking;

  try {
    const [result] = await pool.query(
      `INSERT INTO consultation_bookings
      (
        full_name, email, company, role, phone, whatsapp, country, location,
        address, mode, date, time, duration, cost,
        reference_websites, project_details, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        company,
        role,
        phone,
        whatsapp,
        country,
        location,
        address,
        mode,
        date,
        time,
        duration,
        cost,
        reference_websites || null,
        project_details || null,
        status || 0,
      ]
    );

    return {
      success: true,
      message: "Consultation booking inserted successfully",
      insertId: result.insertId,
    };
  } catch (error) {
    console.error("Error inserting consultation booking:", error);
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}

async function getAllConsultationBookings() {
  try {
    const [rows] = await pool.query(
      // Convert the DATE column to a plain string using MySQL’s DATE_FORMAT
      `SELECT id, 
              full_Name,
              email,
              company,
              role,
              phone,
              whatsapp,
              country,
              location,
              address,
              mode,
              DATE_FORMAT(date, '%Y-%m-%d') AS date,
              time,
              duration,
              cost,
              reference_websites,
              project_details,
              created_at
       FROM consultation_bookings`
    );

    return {
      success: true,
      message: "Consultation bookings retrieved successfully",
      data: rows,
    };
  } catch (error) {
    console.error("Error fetching consultation bookings:", error);
    return {
      success: false,
      message: "Internal Server Error",
      error: error.message,
    };
  }
}



module.exports = { insertConsultationBooking, getAllConsultationBookings };
