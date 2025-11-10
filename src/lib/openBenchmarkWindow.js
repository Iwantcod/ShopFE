const BENCHMARK_COLOR_RULES = {
  avgFrame1: [
    { max: 24, color: '#fecaca', label: '부족' },
    { max: 39, color: '#fed7aa', label: '약간 부족' },
    { max: 54, color: '#bef264', label: '보통' },
    { max: 69, color: '#bfdbfe', label: '약간 우수' },
    { max: Infinity, color: '#ddd6fe', label: '우수' },
  ],
  avgFrame2: [
    { max: 44, color: '#fecaca', label: '부족' },
    { max: 59, color: '#fed7aa', label: '약간 부족' },
    { max: 74, color: '#bef264', label: '보통' },
    { max: 89, color: '#bfdbfe', label: '약간 우수' },
    { max: Infinity, color: '#ddd6fe', label: '우수' },
  ],
  avgFrame3: [
    { max: 49, color: '#fecaca', label: '부족' },
    { max: 89, color: '#fed7aa', label: '약간 부족' },
    { max: 129, color: '#bef264', label: '보통' },
    { max: 179, color: '#bfdbfe', label: '약간 우수' },
    { max: Infinity, color: '#ddd6fe', label: '우수' },
  ],
};

function classifyBenchmark(metric, value) {
  const ranges = BENCHMARK_COLOR_RULES[metric];
  if (!ranges || !ranges.length) {
    return { color: '#ddd6fe', label: '' };
  }
  return ranges.find((range) => value <= range.max) ?? ranges[ranges.length - 1];
}

export function openBenchmarkWindow(data) {
  const benchWindow = window.open('', '_blank', 'width=520,height=520');
  if (!benchWindow) return;

  const rows = [
    { key: 'avgFrame1', title: '몬스터헌터 와일즈' },
    { key: 'avgFrame2', title: '사이버펑크 2077' },
    { key: 'avgFrame3', title: '배틀그라운드' },
  ]
    .map(({ key, title }) => {
      const value = data[key];
      const { color, label } = classifyBenchmark(key, value);
      return `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;">${title}</td>
          <td style="padding:12px;text-align:right;border-bottom:1px solid #e5e7eb;">
            <span style="
              display:inline-block;
              padding:6px 12px;
              border-radius:9999px;
              background:${color};
              font-weight:600;
              min-width:72px;
              text-align:center;
            ">
              ${value} FPS<br />
              <small style="display:block;font-weight:400;color:#374151;">${label}</small>
            </span>
          </td>
        </tr>
      `;
    })
    .join('');

  benchWindow.document.write(`
    <!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8" />
        <title>CPU / GPU 벤치마크</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 24px; background:#f9fafb; color:#111827; }
          h1 { font-size: 20px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12); }
          th { text-align: left; padding: 12px; background: #f3f4f6; font-size: 13px; color:#4b5563; letter-spacing: 0.02em; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <h1>CPU / GPU 벤치마크</h1>
        <p style="margin-bottom:16px;color:#4b5563;">${data.cpuModelName} + ${data.graphicModelName}</p>
        <table>
          <thead>
            <tr>
              <th>게임</th>
              <th style="text-align:right;">평균 FPS</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  benchWindow.document.close();
}
