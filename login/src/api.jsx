const API_URL = import.meta.env.VITE_MSCU_API_URL;
const API_KEY = import.meta.env.VITE_MSCU_API_KEY;

const loadShipments1 = async () => {
  try {
    const res = await fetch(`${API_URL}/shipments`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await res.json();
    setShipmentList(data.shipments || []);
  } catch (err) {
    console.error("Failed to load shipments from API:", err);
  }
};


useEffect(() => {
 
}, [auth]);
