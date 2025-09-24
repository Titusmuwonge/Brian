module.exports = function(eleventyConfig) {
  // Pass through the admin folder to the final build
  eleventyConfig.addPassthroughCopy("admin");

  return {
    dir: {
      input: "content", // Tell Eleventy where your content files are
      output: "_site",  // Tell Eleventy where to build the final site
      includes: "_includes" // Tell Eleventy where your includes folder is
    }
  };
};