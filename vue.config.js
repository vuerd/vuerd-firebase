module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/scss/color.scss";
          @import "@/scss/size.scss";
        `
      }
    }
  },
  chainWebpack(config) {
    config.output.chunkFilename("js/[name].js?[chunkhash]=chunkhash");
    config.plugins.delete("prefetch");
  }
};
