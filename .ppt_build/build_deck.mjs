import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "C:\\Users\\ASUS\\Documents\\ChatGPT\\New project";
const buildDir = path.join(workspaceDir, ".ppt_build");
const assetDir = path.join(buildDir, "assets");
const outputDir = path.join(workspaceDir, "output");
const SKILL_DIR = "C:\\Users\\ASUS\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.909.11814\\skills\\presentations";
const RUNTIME_PYTHON = "C:\\Users\\ASUS\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const FINAL_PPTX = path.join(outputDir, "让·努维尔建筑声环境分析_四页.pptx");

const { resolvePresentationFont, finalizePresentation } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools/artifact_tool_utils.mjs")).href,
);

await fs.mkdir(buildDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

const family = resolvePresentationFont({ fontFamily: "Microsoft YaHei" });
const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });

const C = {
  bg: "#101722",
  bg2: "#161F2D",
  paper: "#F1EEE8",
  ink: "#16202B",
  white: "#F8F6F1",
  muted: "#B9C1CA",
  line: "#34404D",
  kkl: "#6CC3D5",
  dr: "#F1A451",
  paris: "#C8A8FF",
};

function addText(slide, text, position, opts = {}) {
  const box = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: opts.fill ?? "none",
    line: opts.line ?? { fill: "none", width: 0 },
    borderRadius: opts.borderRadius,
  });
  box.text = text;
  box.text.style = {
    typeface: family,
    fontSize: opts.fontSize ?? 24,
    bold: opts.bold ?? false,
    color: opts.color ?? C.white,
    alignment: opts.alignment ?? "left",
    verticalAlignment: opts.verticalAlignment ?? "top",
    autoFit: opts.autoFit ?? "none",
    wrap: "square",
    lineSpacing: opts.lineSpacing ?? 1.08,
    insets: opts.insets ?? { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return box;
}

function addLine(slide, left, top, width, color, weight = 2) {
  return slide.shapes.add({
    geometry: "line",
    position: { left, top, width, height: 0 },
    fill: "none",
    line: { style: "solid", fill: color, width: weight },
  });
}

function addCaseSlide({ index, meta, title, subtitle, accent, imageBytes, imageAlt, imageCredit, points, takeaway, notes }) {
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;

  slide.images.add({
    blob: imageBytes,
    contentType: "image/jpeg",
    alt: imageAlt,
    fit: "cover",
    position: { left: 0, top: 0, width: 730, height: 720 },
  });

  slide.shapes.add({
    geometry: "rect",
    position: { left: 0, top: 592, width: 730, height: 128 },
    fill: "#0B1018/76",
    line: { fill: "none", width: 0 },
  });
  addText(slide, imageCredit, { left: 38, top: 658, width: 650, height: 28 }, {
    fontSize: 14, color: "#D9DEE4", verticalAlignment: "middle",
  });

  slide.shapes.add({
    geometry: "rect",
    position: { left: 730, top: 0, width: 550, height: 720 },
    fill: C.bg,
    line: { fill: "none", width: 0 },
  });
  slide.shapes.add({
    geometry: "rect",
    position: { left: 730, top: 0, width: 5, height: 720 },
    fill: accent,
    line: { fill: "none", width: 0 },
  });

  addText(slide, `案例 ${index}  ${meta}`, { left: 780, top: 38, width: 430, height: 30 }, {
    fontSize: 17, bold: true, color: accent, verticalAlignment: "middle",
  });
  addText(slide, title, { left: 780, top: 76, width: 435, height: 78 }, {
    fontSize: 42, bold: true, color: C.white, lineSpacing: 0.98,
  });
  addText(slide, subtitle, { left: 780, top: 158, width: 435, height: 44 }, {
    fontSize: 27, color: C.muted, verticalAlignment: "middle",
  });
  addLine(slide, 780, 214, 430, C.line, 1.3);

  const ys = [236, 350, 464];
  points.forEach((point, i) => {
    addText(slide, String(i + 1).padStart(2, "0"), { left: 780, top: ys[i], width: 48, height: 50 }, {
      fontSize: 36, bold: true, color: accent,
    });
    addText(slide, point.label, { left: 842, top: ys[i] + 1, width: 360, height: 28 }, {
      fontSize: 19, bold: true, color: accent,
    });
    addText(slide, point.text, { left: 842, top: ys[i] + 31, width: 365, height: 74 }, {
      fontSize: 21, color: C.white, lineSpacing: 1.12,
    });
  });

  slide.shapes.add({
    geometry: "rect",
    position: { left: 780, top: 604, width: 430, height: 76 },
    fill: "#202B39",
    line: { style: "solid", fill: accent, width: 1.2 },
    borderRadius: 10,
  });
  addText(slide, takeaway, { left: 800, top: 616, width: 390, height: 52 }, {
    fontSize: 21, bold: true, color: C.white, verticalAlignment: "middle", lineSpacing: 1.08,
  });
  addText(slide, index, { left: 1214, top: 680, width: 32, height: 18 }, {
    fontSize: 14, color: C.muted, alignment: "right",
  });
  slide.speakerNotes.textFrame.setText(notes);
}

const [kkl, dr, paris] = await Promise.all([
  fs.readFile(path.join(assetDir, "kkl.jpg")),
  fs.readFile(path.join(assetDir, "dr.jpg")),
  fs.readFile(path.join(assetDir, "paris.jpg")),
]);

addCaseSlide({
  index: "01",
  meta: "瑞士·卢塞恩  1998–2000",
  title: "卢塞恩文化与会议中心",
  subtitle: "耦合空间让混响可调",
  accent: C.kkl,
  imageBytes: kkl,
  imageAlt: "卢塞恩文化与会议中心主音乐厅演出场景",
  imageCredit: "主音乐厅：狭长空间、侧墙浮雕与舞台反射罩共同塑造声场",
  points: [
    { label: "空间", text: "鞋盒式大厅保持较近的侧墙距离，为观众提供清晰的侧向反射。" },
    { label: "界面", text: "墙面石膏浮雕打散镜面反射，舞台上方反射罩帮助演奏者互听。" },
    { label: "调节", text: "大厅与附加混响室通过可控开口连接，可改变声音的延续程度。" },
  ],
  takeaway: "听觉结果：声音清晰而丰满，并能适应不同规模的音乐作品",
  notes: [
    "内容来源：",
    "https://www.kkl-luzern.ch/en/about-us/architecture-acoustics",
    "https://www.jeannouvel.com/en/projects/centre-de-culture-et-des-congres/",
    "图片来源：KKL Luzern，https://business.kkl-luzern.ch/en/venues/concert-hall",
  ].join("\n"),
});

addCaseSlide({
  index: "02",
  meta: "丹麦·哥本哈根  2002–2009",
  title: "丹麦广播音乐厅",
  subtitle: "梯田式座席组织早期反射",
  accent: C.dr,
  imageBytes: dr,
  imageAlt: "丹麦广播音乐厅暖色木质大厅与环绕舞台的观众席",
  imageCredit: "葡萄园式布局：观众席分区围绕舞台，反射面靠近听众",
  points: [
    { label: "空间", text: "葡萄园式座席围绕中央舞台，缩短观众与声源的视觉和听觉距离。" },
    { label: "反射", text: "座席高差形成矮墙和倾斜界面，为不同分区补充较早到达的反射声。" },
    { label: "适应", text: "高大容积保留余韵，可调舞台反射板和吸声帘适配不同节目。" },
  ],
  takeaway: "听觉结果：声音更直接、亲近，观众获得较强的共同参与感",
  notes: [
    "内容来源：",
    "https://www.nagata-i.com/portfolio/danish-radio-concert-hall/",
    "https://www.acoustics.asn.au/conference_proceedings/ICA2010/cdrom-ISRA2010/Papers/P3e.pdf",
    "图片来源：DR Koncerthuset，https://billet.drkoncerthuset.dk/venue/koncertsalen/",
  ].join("\n"),
});

addCaseSlide({
  index: "03",
  meta: "法国·巴黎  2007–2015",
  title: "巴黎爱乐音乐厅",
  subtitle: "嵌套空间分配早期与后期声能",
  accent: C.paris,
  imageBytes: paris,
  imageAlt: "巴黎爱乐音乐厅悬浮楼座与云状反射体",
  imageCredit: "悬浮楼座位于更大的厅堂容积中，内外两层共同组织反射声",
  points: [
    { label: "内层", text: "楼座前沿、分区墙和云状反射体提供早期反射，保持声音清晰。" },
    { label: "外层", text: "声音绕过悬浮楼座进入外围容积，形成较晚反射和包围感。" },
    { label: "隔声", text: "“盒中盒”围护构造削弱周边道路与演出设施噪声对弱音的掩蔽。" },
  ],
  takeaway: "听觉结果：舞台声音近而明确，混响从周围展开，形成沉浸感",
  notes: [
    "内容来源：",
    "https://philharmoniedeparis.fr/en/discover/philharmonie",
    "https://marshallday.squarespace.com/news-posts/eeting-of-minds-philharmonie-de-paris",
    "图片来源：Architectural Record，https://www.architecturalrecord.com/articles/11660-philharmonie-de-paris-grande-salle",
  ].join("\n"),
});

{
  const slide = presentation.slides.add();
  slide.background.fill = C.paper;
  addText(slide, "三种空间组织声音的方式", { left: 68, top: 42, width: 850, height: 60 }, {
    fontSize: 46, bold: true, color: C.ink,
  });
  addText(slide, "比较重点：反射声从哪里产生、何时到达，以及空间如何调节余韵", { left: 70, top: 105, width: 1040, height: 34 }, {
    fontSize: 23, color: "#53606D",
  });
  addLine(slide, 70, 145, 1140, "#BBB5AA", 1.2);

  const values = [
    ["比较维度", "卢塞恩 KKL", "丹麦广播音乐厅", "巴黎爱乐音乐厅"],
    ["空间原型", "鞋盒式大厅\n＋附加混响室", "葡萄园式座席\n围绕中央舞台", "悬浮楼座\n置于大容积内"],
    ["声学核心", "侧墙与浮雕扩散反射；耦合空间延长余韵", "分区矮墙提供早期反射，拉近舞台与观众", "内层保证清晰度，外围空间形成后期混响"],
    ["可调方式", "控制混响室开口与舞台反射罩", "调节舞台反射板和吸声帘", "调节外围吸声与舞台附近反射条件"],
    ["主要听感", "清晰、丰满\n适应性强", "直接、亲近\n参与感强", "清晰、包围\n空间感强"],
  ];

  const table = slide.tables.add({
    rows: 5,
    columns: 4,
    left: 68,
    top: 168,
    width: 1144,
    height: 410,
    columnWidths: [150, 330, 330, 334],
    values,
  });
  table.borders.assign({ style: "solid", fill: "#C9C3B8", width: 1 });
  table.rows[0].height = 58;
  table.rows[1].height = 82;
  table.rows[2].height = 108;
  table.rows[3].height = 82;
  table.rows[4].height = 80;

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = table.getCell(r, c);
      cell.text.style = {
        typeface: family,
        fontSize: r === 0 ? 21 : 19,
        bold: r === 0 || c === 0,
        color: r === 0 ? C.white : C.ink,
        alignment: c === 0 ? "center" : "left",
        verticalAlignment: "middle",
        autoFit: "shrinkText",
        insets: { top: 8, right: 12, bottom: 8, left: 12 },
      };
      cell.fill = r === 0 ? C.bg2 : (c === 0 ? "#DDD8CF" : (r % 2 === 0 ? "#F8F6F1" : "#ECE8E0"));
    }
  }
  table.getCell(0, 1).fill = "#2C7788";
  table.getCell(0, 2).fill = "#A46527";
  table.getCell(0, 3).fill = "#6C5795";

  slide.shapes.add({
    geometry: "rect",
    position: { left: 68, top: 607, width: 1144, height: 70 },
    fill: C.bg,
    line: { fill: "none", width: 0 },
    borderRadius: 10,
  });
  addText(slide, "共同点：大厅容积、楼座与墙面直接参与声场组织，建筑形态本身就是声学装置。", { left: 94, top: 618, width: 1090, height: 48 }, {
    fontSize: 24, bold: true, color: C.white, verticalAlignment: "middle",
  });
  addText(slide, "04", { left: 1212, top: 688, width: 34, height: 18 }, {
    fontSize: 14, color: "#6C737C", alignment: "right",
  });
  slide.speakerNotes.textFrame.setText([
    "比较依据：前三页所列项目官方资料与声学顾问资料。",
    "https://www.kkl-luzern.ch/en/about-us/architecture-acoustics",
    "https://www.nagata-i.com/portfolio/danish-radio-concert-hall/",
    "https://philharmoniedeparis.fr/en/discover/philharmonie",
  ].join("\n"));
}

for (let i = 0; i < presentation.slides.items.length; i++) {
  const slide = presentation.slides.items[i];
  const preview = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(buildDir, `draft-slide-${i + 1}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const requirements = {
  explicitTotalSlideCount: 4,
  requiredNativeTableOwnerSlides: [4],
  requiredNativeChartOwnerSlides: [],
};
const fontPolicy = { basis: "design", families: [family], scriptFonts: { ea: family } };
const stagingDir = path.join(workspaceDir, ".codex-finalizer");
await fs.mkdir(stagingDir, { recursive: true });
const candidatePath = path.join(stagingDir, "candidate-jean-nouvel-acoustics.pptx");
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const result = await finalizePresentation({
  ...requirements,
  workspaceDir,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
    "--require-native-table-slide", "4",
  ],
  requiredNativeTableOwnerSlides: [4],
  fontPolicy,
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "让·努维尔建筑声环境分析_四页.validation.json"),
});

console.log(JSON.stringify({ final: FINAL_PPTX, result, family }, null, 2));
