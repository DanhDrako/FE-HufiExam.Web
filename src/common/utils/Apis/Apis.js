/*
  Defined list api here
*/

const Apis = {
  API_HOST: process.env.REACT_APP_API_END_POINT,
  APT_IPFS_HEAD: process.env.REACT_APP_API_IPFS_HEAD,
  API_IMGUR_VIEW: process.env.REACT_APP_IMGUR_API_VIEW,
  IS_SHOW_ADS: String(process.env.REACT_APP_SHOW_ADS).trim(),
  NODE_ENV_PROD: String(process.env.REACT_APP_NODE_ENV).toLowerCase().trim() === 'prod',
  REACT_APP_DATA_TYPE_MY_HUFIER: process.env.REACT_APP_DATA_TYPE_MY_HUFIER,
  NUM_PER_PAGE: 10,
  WAIT_FOR_DOWNLOAD: Number(process.env.REACT_APP_WAIT_FOR_DOWNLOAD),

  API_TAILER: {
    AUTH: '/auth/',
    USER: '/user/',
    AUTH_REFRESH: '/auth/refresh/',
    CATE: '/category/',
    TAG_NAME: '/tag-name/',
    IMG_VIEW: '/files/image/',
    UPLOAD_IMAGE_IPFS: '/files/image/ipfs/',
    UPLOAD_IMAGE_SERVER: '/files/image/server/',
    UPLOAD_IMAGE_IMGUR: '/files/image/imgur/',
    POST: '/post/',
    REALEXAMOWN: '/real-exam-own/',
    CHECK_REALEXAMOWN: '/real-exam-own/checkexamreal/',
    POST_FILTER: '/post/filter/v1',
    POST_MANAGE: '/post/manage/v1',
    POST_COMMIT: '/post/commit/',
    POST_SHOWRANK: '/post/showRank/',
    USER_ACTIVE: '/user/active/',
    RESET_PASSWORD: '/user/reset-password/',
    USER_REACT: '/user-react/',
    COUNT_EXAM_REACT: '/user-react/count-exam/',
    COMMENT: '/comment/',
    COMMENT_REACT: '/comment-react/',
    AUTH_FACEBOOK: '/auth/facebook',
    AUTH_GOOGLE: '/auth/google',
    PDF_TO_TEXT: '/files/pdf2text/',
    TEXT_TO_JSON: '/files/text2json/',
    FILE: '/files/',
    INSERT_QUESTION_ANSWER: '/files/insert-qa/',
    USER2USER_MESSAGE: '/user2user-message/',
    SUGESSTION: '/support/',
    LIST_USER_CHAT_HISTORIES: '/user2user-message/userChatHistories/',
    QUESTION_ANSWER: '/question-answer/',
    RANK: '/rank/',
    REAL_TEST: 'realTest/',
    PRICE_GOLD: '/price-gold'
  }
}

export default Apis;
