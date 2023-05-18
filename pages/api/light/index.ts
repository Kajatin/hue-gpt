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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      `${process.env.HUE_BASE_URL}/clip/v2/resource/light`,
      {
        method: "GET",
        headers: {
          "hue-application-key": process.env.HUE_APP_KEY!,
        },
        agent: httpsAgent,
      }
    );

    const data: any = await response.json();

    console.log(data.data);

    data.data.sort((a: any, b: any) => {
      if (a.metadata.name < b.metadata.name) {
        return -1;
      } else {
        return 1;
      }
    });

    res.status(200).json(data.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
}
