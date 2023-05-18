import { NextApiRequest, NextApiResponse } from "next";
import https from "https";
import fetch from "node-fetch";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { brightness, x, y } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!id || !brightness || !x || !y) {
    return res.status(400).json({ error: "Missing required parameter(s)" });
  }

  try {
    const response = await fetch(
      `${process.env.HUE_BASE_URL}/clip/v2/resource/light/${id}`,
      {
        method: "PUT",
        headers: {
          "hue-application-key": process.env.HUE_APP_KEY!,
        },
        body: JSON.stringify({
          on: {
            on: true,
          },
          dimming: {
            brightness: brightness,
          },
          color: {
            xy: {
              x: x,
              y: y,
            },
          },
        }),
        agent: httpsAgent,
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}
