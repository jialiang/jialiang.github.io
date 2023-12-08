const fs = require("fs");
const marked = require("marked");

const template = `<div class="faq" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
  <h4
    class="question"
    itemprop="name"
    tabindex="0"
    aria-expanded="false"
    aria-controls="{{id}}">
   {{question}}
  </h4>

  <div
    id="{{id}}"
    class="answer"
    itemscope
    itemprop="acceptedAnswer"
    itemtype="https://schema.org/Answer">
    <div itemprop="text">
      {{answer}}
    </div>
  </div>
</div>`;

const input = "\n" + fs.readFileSync("faq.md", "utf-8");

let output = "";

input.split("\n# ").forEach((section, i) => {
  if (section.trim() === "") return;

  const lines = section.split("\n");

  output += `<h3>${lines[0].trim()}</h3>\n\n`;

  lines.shift();

  const faqs = lines.join("\n").split("\n## ");

  faqs.forEach((faq, j) => {
    if (faq.trim() === "") return;

    const lines = faq.split("\n");

    const question = lines[0].trim();

    lines.shift();

    const answer = marked.parse(lines.join("\n")).trim();

    output += template
      .replace(/{{id}}/gi, `s${i}a${j}`)
      .replace("{{question}}", question)
      .replace("{{answer}}", answer);

    output += "\n\n";
  });
});

console.log(`
  <div>
    ${output.trim()}
  </div>
`);
