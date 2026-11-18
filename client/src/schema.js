// Field tuples: [key, type, label]
// types: text | area | list (one per line) | bool | image | media | file
export const SITE_GROUPS = [
  { group: 'Header & hero', fields: [
    ['short_name', 'text', 'Header name'], ['status_text', 'text', 'Header status'], ['header_cta', 'text', 'Header button'],
    ['hero_badge', 'text', 'Top badge'], ['hero_eyebrow', 'text', 'Hero eyebrow'],
    ['hero_1', 'text', 'Headline line 1'], ['hero_highlight', 'text', 'Headline highlighted word'],
    ['hero_3', 'text', 'Headline line 3'], ['hero_4', 'text', 'Headline line 4'],
    ['hero_intro', 'area', 'Intro paragraph'], ['explore_label', 'text', 'Primary button'],
    ['cv_label', 'text', 'CV button label'], ['cv_url', 'file', 'CV file (PDF)'], ['scroll_label', 'text', 'Scroll hint'],
    ['photo_url', 'image', 'Profile photo'], ['node_label', 'text', 'Photo tag (left)'], ['availability_badge', 'text', 'Photo tag (right)'],
    ['full_name', 'text', 'Full name'], ['age_label', 'text', 'Age label'], ['role_title', 'text', 'Role / status'],
    ['degree_line', 'text', 'Degree line'], ['focus_1', 'text', 'Focus tag 1'], ['focus_2', 'text', 'Focus tag 2'],
    ['academic_focus', 'text', 'Bottom left'], ['graduation', 'text', 'Bottom right'],
  ]},
  { group: 'Social links', fields: [['socials', 'list', 'One per line:  type|Label|url   (types: github, linkedin, email, whatsapp, facebook, instagram)']] },
  { group: 'About', fields: [
    ['about_eyebrow', 'text', 'Eyebrow'], ['about_title', 'area', 'Title (new line = line break)'], ['about_uni_label', 'text', 'University label'],
    ['about_lead_before', 'text', 'Lead text (before highlight)'], ['about_lead_highlight', 'text', 'Lead highlight'], ['about_lead_after', 'text', 'Lead text (after highlight)'],
    ['about_body', 'area', 'Body'], ['quote', 'text', 'Quote'], ['quote_author', 'text', 'Quote author'],
    ['edu_label', 'text', 'Education card label'], ['edu_title', 'text', 'Degree'], ['edu_campus', 'text', 'Campus'],
    ['network_label', 'text', 'Social card label'], ['network_tag', 'text', 'Social card tag'], ['network_footer', 'text', 'Social card footer'],
  ]},
  { group: 'Section headings', fields: [
    ['projects_eyebrow', 'text', 'Projects eyebrow'], ['projects_title', 'text', 'Projects title'], ['projects_sub', 'text', 'Projects subtitle'],
    ['projects_badge1', 'text', 'Projects badge 1'], ['projects_badge2', 'text', 'Projects badge 2'],
    ['skills_eyebrow', 'text', 'Skills eyebrow'], ['skills_title', 'area', 'Skills title'], ['skills_sub', 'text', 'Skills subtitle'],
    ['experience_eyebrow', 'text', 'Experience eyebrow'], ['experience_title', 'text', 'Experience title'], ['experience_sub', 'text', 'Experience subtitle'],
    ['leadership_eyebrow', 'text', 'Leadership eyebrow'], ['leadership_title', 'text', 'Leadership title'], ['leadership_sub', 'text', 'Leadership subtitle'],
    ['certificates_eyebrow', 'text', 'Certificates eyebrow'], ['certificates_title', 'text', 'Certificates title'], ['certificates_sub', 'text', 'Certificates subtitle'],
  ]},
  { group: 'Contact & footer', fields: [
    ['contact_eyebrow', 'text', 'Contact eyebrow'], ['contact_title', 'text', 'Contact title'], ['contact_sub', 'text', 'Contact subtitle'],
    ['location_name', 'text', 'Location'], ['coordinates', 'text', 'Coordinates'], ['email', 'text', 'Email'], ['phone', 'text', 'Phone'],
    ['timezone_text', 'text', 'Timezone text'], ['open_status', 'text', 'Status text'],
    ['scope_options', 'list', 'Engagement scope options (one per line)'], ['success_message', 'text', 'Form success message'],
    ['footer_eyebrow', 'text', 'Footer eyebrow'], ['footer_title', 'text', 'Footer title'], ['geographic_base', 'text', 'Geographic base'],
    ['footer_left_1', 'text', 'Footer left 1'], ['footer_left_2', 'text', 'Footer left 2'], ['copyright', 'text', 'Copyright'],
    ['timezone', 'text', 'Clock timezone (e.g. Africa/Johannesburg)'],
  ]},
];

const timeline = [
  ['period', 'text', 'Period (e.g. JAN 2026 — PRESENT)'], ['role', 'text', 'Role'], ['org', 'text', 'Organisation'],
  ['location', 'text', 'Location line'], ['bullets', 'list', 'Bullet points (one per line)'],
  ['badge', 'text', 'Badge'], ['active', 'bool', 'Highlight as current / active'],
];

export const ITEM_SCHEMAS = {
  projects: { label: 'Projects', titleKey: 'title', fields: [
    ['code', 'text', 'Code (e.g. [PROJ_01] // FLAGSHIP ENTERPRISE)'], ['status', 'text', 'Status tag'], ['title', 'text', 'Title'],
    ['subtitle', 'text', 'Subtitle (large layout only)'], ['description', 'area', 'Description'], ['tech', 'list', 'Tech stack (one per line)'],
    ['link_label', 'text', 'Link label'], ['link_url', 'text', 'Link URL'], ['media_url', 'media', 'Demo video or image'],
    ['media_caption', 'text', 'Media caption'], ['featured', 'bool', 'Large featured layout'],
  ]},
  skills: { label: 'Skills', titleKey: 'title', fields: [
    ['title', 'text', 'Category title (e.g. // 01: FRONTEND & WEB)'], ['icon', 'text', 'Material icon name (e.g. devices, terminal, database, hub)'],
    ['items', 'list', 'Skills (one per line)'],
  ]},
  experience: { label: 'Experience', titleKey: 'org', fields: timeline },
  leadership: { label: 'Leadership', titleKey: 'org', fields: timeline },
  certificates: { label: 'Certificates', titleKey: 'title', fields: [
    ['image_url', 'image', 'Certificate image'], ['cert_id', 'text', 'ID tag'], ['tag', 'text', 'Top-right tag'], ['period', 'text', 'Period'],
    ['badge', 'text', 'Status badge'], ['title', 'text', 'Title'], ['issuer', 'text', 'Issuer'], ['description', 'area', 'Description'],
    ['tags', 'list', 'Tags (one per line)'], ['footer', 'text', 'Footer text'], ['auth_label', 'text', 'Footer right label'],
  ]},
};
