import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for handling screenshot uploads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // API Endpoint: Parse screenshot / image using Gemini API
  app.post("/api/parse-screenshot", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/png" } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ success: false, error: "Thiếu dữ liệu ảnh imageBase64" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ success: false, error: "GEMINI_API_KEY chưa được cấu hình trên máy chủ" });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Clean base64 string if data URL prefix exists
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `
Bạn là trợ lý AI chuyên đọc dữ liệu cửa hàng hoa tươi. 
Hãy đọc phân tích kĩ hình ảnh này (có thể là ảnh chụp bảng tính Excel, báo giá, hóa đơn, bài viết bán hàng, danh sách viết tay) và trích xuất tất cả sản phẩm hoa tươi tìm thấy.

Trả về duy nhất một mã JSON array thuần túy (không bọc trong markdown \`\`\`json hay văn bản thừa), theo định dạng sau:
[
  {
    "name": "Tên mẫu hoa (ví dụ: Bó Hoa Hồng Đỏ Ecuador)",
    "price": 350000,
    "unitQuantity": "10 cành" hoặc "1 bó" hoặc "1 lẵng",
    "category": "bouquet", 
    "description": "Mô tả hoa ngắn gọn"
  }
]

Quy tắc giá (price): 
- Chuyển tất cả về số nguyên VND. Ví dụ: 350k -> 350000, 1.2tr -> 1200000, 500.000đ -> 500000.
Quy tắc danh mục (category):
- "bouquet": Bó hoa
- "basket": Lẵng/Giỏ hoa
- "table": Hoa để bàn/trang trí
- "event": Hoa sự kiện/khai trương
- "luxury": Hoa cao cấp/nhập khẩu
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
            ],
          },
        ],
      });

      const responseText = response.text || "";
      // Strip markdown wrapping if model returns ```json ... ```
      const cleanedJsonText = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const items = JSON.parse(cleanedJsonText);
      return res.json({ success: true, items });
    } catch (error: any) {
      console.error("Error parsing screenshot with Gemini:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Không thể phân tích ảnh bằng AI. Vui lòng thử lại với ảnh rõ nét hơn.",
      });
    }
  });

  // Helper: Parse Google Sheets HTML table to extract hyperlinked cell URLs
  function parseGsheetHtmlTable(htmlText: string): Record<string, string>[] {
    const rows: Record<string, string>[] = [];
    const trMatches = htmlText.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (!trMatches || trMatches.length === 0) return rows;

    const headers: string[] = [];
    const firstTr = trMatches[0];
    const tdMatches = firstTr.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
    tdMatches.forEach((td) => {
      const cleanText = td.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").trim();
      headers.push(cleanText);
    });

    if (headers.length === 0) return rows;

    for (let i = 1; i < trMatches.length; i++) {
      const tr = trMatches[i];
      const cells = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      if (cells.length === 0) continue;

      const rowObj: Record<string, string> = {};
      let hasData = false;

      cells.forEach((cell, colIdx) => {
        const headerName = headers[colIdx] || `Col_${colIdx}`;
        const linkMatch = cell.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
        const textWithoutTags = cell.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").trim();

        if (linkMatch && linkMatch[1]) {
          let href = linkMatch[1].trim();
          if (href.includes("google.com/url?") || href.includes("google.com/url%3F")) {
            const qMatch = href.match(/[?&]q=([^&]+)/);
            if (qMatch && qMatch[1]) {
              href = decodeURIComponent(qMatch[1]);
            }
          }

          if (
            /ảnh|hình|image|url|link/i.test(headerName) ||
            /drive\.google\.com|googleusercontent|http/i.test(href)
          ) {
            rowObj[headerName] = href;
          } else if (/^(https?:\/\/|drive\.google)/i.test(textWithoutTags)) {
            rowObj[headerName] = textWithoutTags;
          } else {
            rowObj[headerName] = href || textWithoutTags;
          }
        } else {
          rowObj[headerName] = textWithoutTags;
        }

        if (rowObj[headerName]) {
          hasData = true;
        }
      });

      if (hasData) {
        rows.push(rowObj);
      }
    }

    return rows;
  }

  // API Endpoint: Fetch public Google Sheets CSV & HTML Hyperlinks
  app.post("/api/fetch-gsheet", async (req, res) => {
    try {
      const { sheetUrl } = req.body;
      if (!sheetUrl || typeof sheetUrl !== "string") {
        return res.status(400).json({ success: false, error: "Thiếu đường dẫn Google Sheets" });
      }

      let csvUrl = sheetUrl.trim();
      let htmlUrl = "";
      const docIdMatch = csvUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      const gidMatch = csvUrl.match(/[?&]gid=(\d+)/) || csvUrl.match(/#gid=(\d+)/);

      if (docIdMatch && docIdMatch[1]) {
        const docId = docIdMatch[1];
        const gid = gidMatch ? gidMatch[1] : "0";
        csvUrl = `https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:csv&gid=${gid}`;
        htmlUrl = `https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:html&gid=${gid}`;
      }

      let parsedRows: Record<string, string>[] = [];

      // Try HTML fetch to preserve hyperlinked cell URLs
      if (htmlUrl) {
        try {
          const htmlRes = await fetch(htmlUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });
          if (htmlRes.ok) {
            const htmlText = await htmlRes.text();
            if (
              !htmlText.includes("ServiceLogin") &&
              !htmlText.includes("Google Drive -- Page Not Found")
            ) {
              parsedRows = parseGsheetHtmlTable(htmlText);
            }
          }
        } catch (e) {
          console.warn("HTML table parse failed, falling back to CSV:", e);
        }
      }

      let response = await fetch(csvUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok && docIdMatch) {
        const docId = docIdMatch[1];
        const gid = gidMatch ? gidMatch[1] : "0";
        const fallbackUrl = `https://docs.google.com/spreadsheets/d/${docId}/export?format=csv&gid=${gid}`;
        response = await fetch(fallbackUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
      }

      const csvText = await response.text();
      const trimmedText = csvText.trim();

      if (
        trimmedText.toLowerCase().startsWith("<!doctype html") ||
        trimmedText.toLowerCase().startsWith("<html") ||
        trimmedText.includes("ServiceLogin") ||
        trimmedText.includes("The page") ||
        trimmedText.includes("Google Drive -- Page Not Found")
      ) {
        return res.status(400).json({
          success: false,
          error: "Trang tính Google Sheet chưa được bật quyền công khai. Vui lòng bấm nút 'Chia sẻ' ở góc phải Google Sheet -> đổi thành 'Bất kỳ ai có liên kết đều có thể xem' rồi nhấn 'Tải Dữ Liệu' lại!",
        });
      }

      if (!trimmedText && parsedRows.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Trang tính Google Sheet rỗng hoặc không có dữ liệu.",
        });
      }

      return res.json({ success: true, csvText, parsedRows });
    } catch (error: any) {
      console.error("Error fetching Google Sheet:", error);
      return res.status(500).json({
        success: false,
        error: "Lỗi kết nối tới Google Sheet. " + (error?.message || ""),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
