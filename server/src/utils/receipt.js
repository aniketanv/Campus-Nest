import PDFDocument from "pdfkit";
import fs from "fs";
export function generateReceipt({ bookingId, user, pg, amount, filepath }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    doc.fontSize(22).text("CampusNest — Booking Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Receipt ID: ${bookingId}`);
    doc.text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`PG: ${pg.name} (${pg.area})`);
    doc.text(`Sharing: ${pg.sharing || "N/A"}`);
    doc.text(`Reserved Amount (mock): ₹${amount}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();
    doc.text("Note: This is a mock receipt (no payment processed).", { align: "center" });
    doc.end();
    stream.on("finish", () => resolve(filepath));
    stream.on("error", reject);
  });
}
