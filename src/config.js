export default {
    httpServerUrl: 'http://api.bagepanzi.com/',
    activityServerUrl: 'http://api.bagepanzi.com:998/',
    apartHttpServerUrl: 'http://api.bagepanzi.com:999/',
    partyDetailUrl: (partyId, uid) => `http://app.bagepanzi.com/dist/index.html?${uid ?'uid='+ uid: ''}#/party-detail/${partyId}`,
};
