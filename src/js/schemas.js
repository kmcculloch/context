import { Schema, arrayOf } from 'normalizr';

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr
const sessionUserSchema = new Schema('session');
const keySchema = new Schema('keys', { idAttribute: 'sha256' });
const userSchema = new Schema('users');
const groupsSchema = new Schema('groups');
const metadataSchema = new Schema('metadata', { idAttribute: metadata => `${metadata.keyId}.${metadata.subject}` });
const searchResultSchema = new Schema('searchResults', { idAttribute: 'url' });
const urlSchema = new Schema('urls', { idAttribute: 'url' });
const linkSchema = new Schema('links', { idAttribute: link => `${link.src.url}.${link.dst.url}` });
const consensusSchema = new Schema('consensus', { idAttribute: 'subject' });
const contentSchema = new Schema('content', { idAttribute: 'hash' });
const collectionSchema = new Schema('colletions');
const primerSchema = new Schema('primers');
const subprimerSchema = new Schema('subprimers');

metadataSchema.new = (attrs) => {
  return Object.assign({}, attrs);
};

// Schemas for Github API responses.
const Schemas = {
  // currently-logged-in user
  SESSION_USER: sessionUserSchema,
  // users. many users. much parcipation.
  USER: userSchema,
  USER_ARRAY: arrayOf(userSchema),
  // user key management
  KEY: keySchema,
  KEY_ARRAY: arrayOf(keySchema),

  // groups of users, currently unimplemeneted
  GROUP: groupsSchema,
  GROUP_ARRAY: arrayOf(groupsSchema),

  PRIMER: primerSchema,
  PRIMER_ARRAY: arrayOf(primerSchema),
  // SUBPRIMER should be the name of an indie steampunk flick, if it isn't already.
  SUBPRIMER: subprimerSchema,
  SUBPRIMER_ARRAY: arrayOf(subprimerSchema),
  // an external url for archiving
  URL: urlSchema,
  URL_ARRAY: arrayOf(urlSchema),
  // link from a src to a dst url
  LINK: linkSchema,
  LINK_ARRAY: arrayOf(linkSchema),

  // structured content, the basis of archiving. content has a shasum
  CONTENT: contentSchema,
  CONTENT_ARRAY: arrayOf(contentSchema),
  // metadata is a user-contributed object that describes content
  METADATA: metadataSchema,
  METADATA_ARRAY: arrayOf(metadataSchema),
  // consensus is the sum of all metadata for a given piece of content
  CONSENSUS: consensusSchema,
  CONSENSUS_ARRAY: arrayOf(consensusSchema),
  // collections are lists of content. they are also content themselves, and can have metadata
  // collections are "special content" on this webapp b/c users can edit them
  COLLECTION: collectionSchema,
  COLLECTION_ARRAY: arrayOf(collectionSchema),

  // search results can be a number of different models
  // searchResult wraps those discrete types
  SEARCH_RESULT: searchResultSchema,
  SEARCH_RESULT_ARRAY: arrayOf(searchResultSchema),
};

export default Schemas;
