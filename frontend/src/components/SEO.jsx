import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, type = 'website' }) => {
  const siteName = "HamroCinema";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Your premier destination for blockbuster entertainment and cinematic experiences.";
  const defaultImage = "/default-og-image.jpg"; // Placeholder path

  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />

      {/* OpenGraph Metadata */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Metadata */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
    </Helmet>
  );
};

export default SEO;
