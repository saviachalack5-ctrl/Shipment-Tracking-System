export const shipments = [
  { id: "100001", time: "2025-10-25", mmsi: "mmsi100001a", bol: "MSCU100001001" }, // Overdue
  { id: "100002", time: "2025-12-05", mmsi: "mmsi100002b", bol: "MSCU100002002" }, // Pending
  { id: "100003", time: "2025-11-05", mmsi: "mmsi100003c", bol: "MSCU100003003" }, // In Transit
  { id: "100004", time: "2025-11-01", mmsi: "mmsi100004d", bol: "MSCU100004004" }, // Docked
  { id: "100005", time: "2025-10-28", mmsi: "mmsi100005e", bol: "MSCU100005005" }, // Overdue
  { id: "100006", time: "2025-11-10", mmsi: "mmsi100006f", bol: "MSCU100006006" }, // In Transit
  { id: "100007", time: "2025-12-12", mmsi: "mmsi100007g", bol: "MSCU100007007" }, // Pending
  { id: "100008", time: "2025-10-30", mmsi: "mmsi100008h", bol: "MSCU100008008" }, // Overdue
  { id: "100009", time: "2025-11-07", mmsi: "mmsi100009i", bol: "MSCU100009009" }, // In Transit
  { id: "100010", time: "2025-11-01", mmsi: "mmsi100010j", bol: "MSCU100010010" }, // Docked
  { id: "100011", time: "2025-12-20", mmsi: "mmsi100011k", bol: "MSCU100011011" }, // Pending
  { id: "100012", time: "2025-10-22", mmsi: "mmsi100012l", bol: "MSCU100012012" }, // Overdue
  { id: "100013", time: "2025-11-12", mmsi: "mmsi100013m", bol: "MSCU100013013" }, // In Transit
  { id: "100014", time: "2025-11-01", mmsi: "mmsi100014n", bol: "MSCU100014014" }, // Docked
  { id: "100015", time: "2025-11-15", mmsi: "mmsi100015o", bol: "MSCU100015015" }, // In Transit
  { id: "100016", time: "2025-10-20", mmsi: "mmsi100016p", bol: "MSCU100016016" }, // Overdue
  { id: "100017", time: "2025-12-02", mmsi: "mmsi100017q", bol: "MSCU100017017" }, // Pending
  { id: "100018", time: "2025-11-08", mmsi: "mmsi100018r", bol: "MSCU100018018" }, // In Transit
  { id: "100019", time: "2025-11-01", mmsi: "mmsi100019s", bol: "MSCU100019019" }, // Docked
  { id: "100020", time: "2025-10-26", mmsi: "mmsi100020t", bol: "MSCU100020020" }, // Overdue

  // extra rows for more data
  { id: "100021", time: "2025-11-18", mmsi: "mmsi100021u", bol: "MSCU100021021" }, // In Transit
  { id: "100022", time: "2025-12-08", mmsi: "mmsi100022v", bol: "MSCU100022022" }, // Pending
  { id: "100023", time: "2025-10-27", mmsi: "mmsi100023w", bol: "MSCU100023023" }, // Overdue
  { id: "100024", time: "2025-11-01", mmsi: "mmsi100024x", bol: "MSCU100024024" }, // Docked
  { id: "100025", time: "2025-11-13", mmsi: "mmsi100025y", bol: "MSCU100025025" }, // In Transit
  { id: "100026", time: "2025-12-15", mmsi: "mmsi100026z", bol: "MSCU100026026" }, // Pending
  { id: "100027", time: "2025-10-29", mmsi: "mmsi100027aa", bol: "MSCU100027027" }, // Overdue
  { id: "100028", time: "2025-11-02", mmsi: "mmsi100028bb", bol: "MSCU100028028" }, // Docked
  { id: "100029", time: "2025-11-14", mmsi: "mmsi100029cc", bol: "MSCU100029029" }, // In Transit
  { id: "100030", time: "2025-12-22", mmsi: "mmsi100030dd", bol: "MSCU100030030" }, // Pending


  ...Array.from({ length: 70 }, (_, i) => {
    const id = 100031 + i;
    const day = 15 + (i % 20); 
    const month = 10 + (i % 3); 
    const statusOptions = ["Overdue", "In Transit", "Docked", "Pending"];
    const status = statusOptions[i % 4];
    const mmsi = `mmsi${id}${String.fromCharCode(97 + (i % 26))}`;
    const bol = `MSCU${id.toString().padStart(6, "0")}${String(i + 1).padStart(3, "0")}`;
    const time = `2025-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    return { id: id.toString(), time, mmsi, bol };
  }),
];
