import { createServer } from "node:http";

const upstream = process.env.STACK_RPC_URL;
if (!upstream) throw new Error("STACK_RPC_URL is required");

const port = Number(process.env.PROXY_PORT ?? 8545);

// the app's anvil chain points at 127.0.0.1:8545; forwarding keeps its config untouched
createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    });
    return res.end();
  }

  if (req.method === "GET") {
    res.writeHead(200, { "content-type": "text/plain" });
    return res.end("ok");
  }

  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    const body = Buffer.concat(chunks).toString();
    try {
      const upstreamRes = await fetch(upstream, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });
      const text = await upstreamRes.text();
      res.writeHead(upstreamRes.status, {
        "content-type": "application/json",
        "access-control-allow-origin": "*",
      });
      res.end(text);
    } catch (err) {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: String(err) }));
    }
  });
}).listen(port, () => console.log(`rpc proxy :${port} -> stack`));
