import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/send-whatsapp", async (req, res) => {
  try {
    const response = await axios.post(
      "https://graph.facebook.com/v19.0/YOUR_PHONE_NUMBER_ID/messages",
      {
        messaging_product: "whatsapp",
        to: "254712345678", // your WhatsApp number
        type: "text",
        text: { body: "Hello Amani! 🚀" },
      },
      {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
