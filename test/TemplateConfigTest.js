const test = require("ava");
import md from "@gerhobbelt/markdown-it";
const TemplateConfig = require("../src/TemplateConfig");
const eleventyConfig = require("../src/EleventyConfig");

test("Template Config local config overrides base config", async (t) => {
  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();

  t.is(cfg.markdownTemplateEngine, "ejs");
  t.is(cfg.templateFormats.join(","), "md,njk");

  // merged, not overwritten
  t.true(Object.keys(cfg.keys).length > 1);
  t.truthy(Object.keys(cfg.handlebarsHelpers).length);
  t.truthy(Object.keys(cfg.nunjucksFilters).length);

  t.is(Object.keys(cfg.filters).length, 1);

  t.is(
    cfg.filters.prettyHtml(
      `<html><body><div></div></body></html>`,
      "test.html"
    ),
    `<html>
  <body>
    <div></div>
  </body>
</html>`
  );
});

test("Add liquid tag", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addLiquidTag("myTagName", function () {});

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.liquidTags).indexOf("myTagName"), -1);
});

test("Add nunjucks tag", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addNunjucksTag("myNunjucksTag", function () {});

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.nunjucksTags).indexOf("myNunjucksTag"), -1);
});

test("Add liquid filter", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addLiquidFilter("myFilterName", function (liquidEngine) {
    return {};
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.liquidFilters).indexOf("myFilterName"), -1);
});

test("Add handlebars helper", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addHandlebarsHelper("myHelperName", function () {});

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.handlebarsHelpers).indexOf("myHelperName"), -1);
});

test("Add nunjucks filter", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addNunjucksFilter("myFilterName", function () {});

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.nunjucksFilters).indexOf("myFilterName"), -1);
});

test("Add universal filter", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addFilter("myFilterName", function () {});

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.liquidFilters).indexOf("myFilterName"), -1);
  t.not(Object.keys(cfg.handlebarsHelpers).indexOf("myFilterName"), -1);
  t.not(Object.keys(cfg.nunjucksFilters).indexOf("myFilterName"), -1);
});
test("Add namespaced universal filter", (t) => {
  eleventyConfig.reset();
  eleventyConfig.namespace("testNamespace", function () {
    eleventyConfig.addFilter("MyFilterName", function () {});
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(
    Object.keys(cfg.liquidFilters).indexOf("testNamespaceMyFilterName"),
    -1
  );
  t.not(
    Object.keys(cfg.handlebarsHelpers).indexOf("testNamespaceMyFilterName"),
    -1
  );
  t.not(
    Object.keys(cfg.nunjucksFilters).indexOf("testNamespaceMyFilterName"),
    -1
  );
});

test("Add namespaced universal filter using underscore", (t) => {
  eleventyConfig.reset();
  eleventyConfig.namespace("testNamespace_", function () {
    eleventyConfig.addFilter("myFilterName", function () {});
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(
    Object.keys(cfg.liquidFilters).indexOf("testNamespace_myFilterName"),
    -1
  );
  t.not(
    Object.keys(cfg.handlebarsHelpers).indexOf("testNamespace_myFilterName"),
    -1
  );
  t.not(
    Object.keys(cfg.nunjucksFilters).indexOf("testNamespace_myFilterName"),
    -1
  );
});

test("Empty namespace", (t) => {
  eleventyConfig.reset();
  eleventyConfig.namespace("", function () {
    eleventyConfig.addNunjucksFilter("myFilterName", function () {});
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.nunjucksFilters).indexOf("myFilterName"), -1);
});

test("Nested Empty Inner namespace", (t) => {
  eleventyConfig.reset();
  eleventyConfig.namespace("testNs", function () {
    eleventyConfig.namespace("", function () {
      eleventyConfig.addNunjucksFilter("myFilterName", function () {});
    });
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.nunjucksFilters).indexOf("testNsmyFilterName"), -1);
});

test("Nested Empty Outer namespace", (t) => {
  eleventyConfig.reset();
  eleventyConfig.namespace("", function () {
    eleventyConfig.namespace("testNs", function () {
      eleventyConfig.addNunjucksFilter("myFilterName", function () {});
    });
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.nunjucksFilters).indexOf("testNsmyFilterName"), -1);
});

// important for backwards compatibility with old
// `module.exports = function (eleventyConfig, pluginNamespace) {`
// plugin code
test("Non-string namespaces are ignored", (t) => {
  eleventyConfig.reset();
  eleventyConfig.namespace(["lkdsjflksd"], function () {
    eleventyConfig.addNunjucksFilter("myFilterName", function () {});
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.nunjucksFilters).indexOf("myFilterName"), -1);
});

test(".addPlugin oddity: I don’t think pluginNamespace was ever passed in here, but we don’t want this to break", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addPlugin(function (eleventyConfig, pluginNamespace) {
    eleventyConfig.namespace(pluginNamespace, () => {
      eleventyConfig.addNunjucksFilter("myFilterName", function () {});
    });
  });

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.nunjucksFilters).indexOf("myFilterName"), -1);
});

test("Test url universal filter with custom pathPrefix (no slash)", (t) => {
  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  templateCfg.setPathPrefix("/testdirectory/");
  let cfg = templateCfg.getConfig();
  t.is(cfg.pathPrefix, "/testdirectory/");
});

test("setTemplateFormats(string)", (t) => {
  eleventyConfig.reset();
  // 0.11.0 removes dupes
  eleventyConfig.setTemplateFormats("ejs,njk, liquid, njk");

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.deepEqual(cfg.templateFormats, ["ejs", "njk", "liquid"]);
});

test("setTemplateFormats(array)", (t) => {
  eleventyConfig.reset();
  eleventyConfig.setTemplateFormats(["ejs", "njk", "liquid"]);

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.deepEqual(cfg.templateFormats, ["ejs", "njk", "liquid"]);
});

test("setTemplateFormats(array, size 1)", (t) => {
  eleventyConfig.reset();
  eleventyConfig.setTemplateFormats(["liquid"]);

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.deepEqual(cfg.templateFormats, ["liquid"]);
});

test("setTemplateFormats(empty array)", (t) => {
  eleventyConfig.reset();
  eleventyConfig.setTemplateFormats([]);

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.deepEqual(cfg.templateFormats, []);
});

test("setTemplateFormats(null)", (t) => {
  eleventyConfig.reset();
  eleventyConfig.setTemplateFormats(null);

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.true(cfg.templateFormats.length > 0);
});

test("multiple setTemplateFormats calls", (t) => {
  eleventyConfig.reset();
  eleventyConfig.setTemplateFormats("njk");
  eleventyConfig.setTemplateFormats("pug");

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.deepEqual(cfg.templateFormats, ["pug"]);
});

test("addTemplateFormats()", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addTemplateFormats("vue");

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  // should have ALL of the original defaults
  t.deepEqual(cfg.templateFormats, ["md", "njk", "vue"]);
});

test("both setTemplateFormats and addTemplateFormats", (t) => {
  // Template Formats can come from three places
  // defaultConfig.js config API (not used yet)
  // defaultConfig.js config return object
  // project config file config API
  // project config file config return object

  eleventyConfig.reset();
  eleventyConfig.addTemplateFormats("vue");
  eleventyConfig.setTemplateFormats("pug");

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.deepEqual(cfg.templateFormats, ["pug", "vue"]);
});

test("libraryOverrides", (t) => {
  let mdLib = md();
  eleventyConfig.setLibrary("md", mdLib);

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.falsy(cfg.libraryOverrides.ldkja);
  t.falsy(cfg.libraryOverrides.njk);
  t.truthy(cfg.libraryOverrides.md);
  t.deepEqual(mdLib, cfg.libraryOverrides.md);
});

test("addGlobalData", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addGlobalData("function", () => new Date());

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.not(Object.keys(cfg.globalData).indexOf("function"), -1);
});

test("Properly throws error on missing module #182", (t) => {
  t.throws(function () {
    new TemplateConfig(
      require("../src/defaultConfig.js"),
      "./test/stubs/broken-config.js"
    );
  });
});

test("Properly throws error when config returns a Promise", (t) => {
  t.throws(function () {
    new TemplateConfig(
      require("../src/defaultConfig.js"),
      "./test/stubs/config-promise.js"
    );
  });
});

test(".addWatchTarget adds a watch target", (t) => {
  eleventyConfig.reset();
  eleventyConfig.addWatchTarget("/testdirectory/");

  let templateCfg = new TemplateConfig(
    require("../src/defaultConfig.js"),
    "./test/stubs/config.js"
  );
  let cfg = templateCfg.getConfig();
  t.deepEqual(cfg.additionalWatchTargets, ["/testdirectory/"]);
});

test("Properly throws error on illegal includes directory", t => {
  t.throws(function() {
    new TemplateConfig(
      require("../config.js"),
      "./test/stubs/config-illegal-includes-dir.js"
    );
  });
});

test("Properly throws error on illegal data directory", t => {
  t.throws(function() {
    new TemplateConfig(
      require("../config.js"),
      "./test/stubs/config-illegal-data-dir.js"
    );
  });
});
