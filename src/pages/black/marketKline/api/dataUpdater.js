/**
 * 数据更新器
 * 通过更新器触发datafeeds的getBars实时更新图表数据
 */
/* eslint-disable */
class dataUpdater {
  constructor(datafeeds) {
      this.subscribers = {}
      this.requestsPending = 0
      this.historyProvider = datafeeds
  }
  subscribeBars(symbolInfo, resolution, newDataCallback, listenerGuid) {
      this.subscribers[listenerGuid] = {
          lastBarTime: null,
          listener: newDataCallback,
          resolution: resolution,
          symbolInfo: symbolInfo
      }
  }
  unsubscribeBars(listenerGuid) {
      delete this.subscribers[listenerGuid]
  }
  updateData() {
      var _this = this;
      if (this.requestsPending) return;
      this.requestsPending = 0;
      for (var listenerGuid in this.subscribers) {
        this.requestsPending++;
        this.updateDataForSubscriber(listenerGuid).then(function () {
          return _this.requestsPending--;
        }).catch(function () {
          return _this.requestsPending--;
        });
      }
  }
  updateDataForSubscriber(listenerGuid) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var subscriptionRecord = _this2.subscribers[listenerGuid];
        var rangeEndTime = parseInt((Date.now() / 1000).toString());
        var rangeStartTime = rangeEndTime - _this2.periodLengthSeconds(subscriptionRecord.resolution, 10);
        _this2.historyProvider.getBars(subscriptionRecord.symbolInfo, subscriptionRecord.resolution, rangeStartTime, rangeEndTime, function (bars) {
          _this2.onSubscriberDataReceived(listenerGuid, bars);
          resolve();
        }, function () {
          reject();
        });
      });
  }
  onSubscriberDataReceived(listenerGuid, bars) {
      if (!this.subscribers.hasOwnProperty(listenerGuid)) return;
      if (!bars.length) return;
      var lastBar = bars[bars.length - 1];
      var subscriptionRecord = this.subscribers[listenerGuid];
      if (subscriptionRecord.lastBarTime !== null && lastBar.time < subscriptionRecord.lastBarTime) return;
      var isNewBar = subscriptionRecord.lastBarTime !== null && lastBar.time > subscriptionRecord.lastBarTime;
      if (isNewBar) {
        if (bars.length < 2) {
          throw new Error('Not enough bars in history for proper pulse update. Need at least 2.');
        }
        var previousBar = bars[bars.length - 2];
        subscriptionRecord.listener(previousBar);
      }

      subscriptionRecord.lastBarTime = lastBar.time;
      subscriptionRecord.listener(lastBar);
  }
  periodLengthSeconds =(resolution, requiredPeriodsCount) => {
      let daysCount = 0
      if (resolution === 'D' || resolution === '1D') {
          daysCount = requiredPeriodsCount
      } else if (resolution === 'M' || resolution === '1M') {
          daysCount = 31 * requiredPeriodsCount
      } else if (resolution === 'W' || resolution === '1W') {
          daysCount = 7 * requiredPeriodsCount
      } else {
          daysCount = requiredPeriodsCount * parseInt(resolution) / (24 * 60)
      }
      return daysCount * 24 * 60 * 60
  }
}
export default dataUpdater
