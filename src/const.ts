// Nostr
export const NOTE = 1;
export const CONTACTS = 3;
export const REPOST = 16;
export const REACTION = 7;
export const ZAP_GOAL = 9041;
export const ZAP = 9735;
export const ZAP_REQUEST = 9734;
export const PROFILE = 0;
export const FILE = 1063;
export const HIGHLIGHT = 9802;
export const MUTED = 10000;
export const PINNED = 10001;
export const RELAYS = 10002;
export const PEOPLE = 30000;
export const BOOKMARKS = 30001;
export const LONG_FORM = 30023;
export const LONG_FORM_DRAFT = 30024;
export const BADGE = 30009;
export const RELAY_LIST = 30022;
export const EMOJIS = 30030;
export const LIVE_EVENT = 30311;
export const ZAPSTR_TRACK = 31337;
export const ZAPSTR_LIST = 31338;
export const LISTS = [
  MUTED,
  PINNED,
  PEOPLE,
  BOOKMARKS,
  ZAPSTR_LIST,
  EMOJIS,
  RELAY_LIST,
];
export const APP = 31990;
export const APP_RECOMMENDATION = 31989;
export const COMMUNITY = 34550;
export const POST_APPROVAL = 4550;
export const JOB_RESULT = 68002;
// Time
export const HOUR = 60 * 60;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 4 * WEEK;

// eslint-disable-next-line no-useless-escape
export const HASHTAG_REGEX = /(#[^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]+)/g;
export const FILE_EXT_REGEX = /\.([\w]{1,7})$/i;

export const HABLA_PUBKEY =
  "7d4e04503ab26615dd5f29ec08b52943cbe5f17bacc3012b26220caa232ab14c";
