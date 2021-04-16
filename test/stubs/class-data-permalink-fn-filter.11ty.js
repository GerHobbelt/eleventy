class Test {
  get data() {
    return {
      title: "My Super Cool Title",
      permalink: function ({ title }, config, tmpl) {
        console.error("TEST PERMALINK FN:", {
          cfg: config ? config.slug : null,
          tpl: tmpl ? tmpl.slug : null,
        });
        function myGetFilter(name) {
          return (
            config.javascriptFunctions[name] ||
            config.nunjucksFilters[name] ||
            config.liquidFilters[name] ||
            config.handlebarsHelpers[name]
          );
        }

        let slugFn = myGetFilter("slug");
        //return `/my-permalink/${this.slug(title)}/`;
        return `/my-permalink/${slugFn(title)}/`;
      },
    };
  }

  render({ name }) {
    return `<p>${name}</p>`;
  }
}

module.exports = Test;
