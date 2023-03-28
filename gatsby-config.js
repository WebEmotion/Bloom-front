module.exports = {
  proxy: {
    prefix: "/api",
    url: "http://dev-mysite.com",
  },
  siteMetadata: {
    title: `Bloom`,
    description: `Casa Bloom.`,
    author: `Digital Ignition`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Casa Bloom`,
        short_name: `Bloom`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#000000`,
        display: `standalone`,
        icon: `src/assets/icons/logo.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: 'gatsby-plugin-htaccess',
      options: {
        RewriteBase: '/custom/',
        https: true,
        www: true,
        SymLinksIfOwnerMatch: true,
        host: 'www.bloomcycling.com', // if 'www' is set to 'false', be sure to also remove it here!
        ErrorDocument: `
          ErrorDocument 401 /error_pages/401.html
          ErrorDocument 404 /error_pages/404.html
          ErrorDocument 500 /error_pages/500.html
        `,
        redirect: [
          'RewriteRule ^not-existing-url/?$ /existing-url [R=301,L,NE]',
          {
            from: 'bloom-cycling.com',
            to: 'bloomcycling.com',
          },
        ],
        custom: `
            # This is a custom rule!
            # This is a another custom rule!
        `,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-179723448-1",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Defers execution of google analytics script after page load
        defer: false
      },
    },
    // {
    //   resolve: "gatsby-plugin-load-script",
    //   options: {
    //     src: "https://evopaymentsmexico.gateway.mastercard.com/checkout/version/57/checkout.js",
    //   },
    // },
  ],
}
