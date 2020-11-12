/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  plugins: [
    'gatsby-plugin-theme-ui',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Rômulo Machado`,
        short_name: `Rômulo`,
        start_url: `/`,
        // background_color: `#f7f0eb`,
        // theme_color: `#a2466c`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
  ],
}
