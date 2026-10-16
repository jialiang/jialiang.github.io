import fs from "fs";

import { marked } from "marked";

const template = `
<div class="faq" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
  <h4 class="question" data-expanded="{{isExpanded}}">
    <button
      type="button"
      itemprop="name"
      aria-expanded="{{isExpanded}}"
      aria-controls="{{id}}">
      {{question}}
    </button>
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

  <div class="border"></div>
</div>`;

export default {
  createFaqHtml: async () => {
    let input = "\n";

    input += await new Promise((resolve, reject) => {
      fs.readFile("./src/faq/faq.md", "utf-8", (error, data) => {
        if (error) reject(error);
        else resolve(data);
      });
    });

    let output = "";
    let isFirstQuestion = true;

    input.split("\n# ").forEach((section, sectionIndex) => {
      if (section.trim() === "") return;

      const lines = section.split("\n");

      output += `<div class="pillars"><div class="hole"><h3>${lines[0].trim()}</h3></div></div>`;
      output += `<div class="faqs">`;

      lines.shift();

      const faqs = lines.join("\n").split("\n## ");

      faqs.forEach((faq, faqIndex) => {
        if (faq.trim() === "") return;

        const lines = faq.split("\n");

        const question = lines[0].trim();

        lines.shift();

        const answer = marked.parse(lines.join("\n")).trim();

        output += template
          .trim()
          .replace(/{{id}}/g, `s${sectionIndex}a${faqIndex}`)
          .replace(/{{isExpanded}}/g, isFirstQuestion)
          .replace("{{question}}", question)
          .replace("{{answer}}", answer);

        isFirstQuestion = false;
      });

      output += `</div>`;
    });

    return output.trim();
  },
};
