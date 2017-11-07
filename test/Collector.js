const Collector = require("../lib/Collector");
const Video = require("../lib/Video");

Video.getAll()
  .then(videos => {
    return Collector.collectStatisticsForVideo()(videos);
  })
  .then(stats => {
    return stats.shares.slice(0, 20);
  })
  .then(console.log);
