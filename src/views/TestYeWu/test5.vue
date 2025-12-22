    // 轮询核销状态
    pollingVerifyStatus(order, timeout) {
      return new Promise((resolve) => {
        this.showLotteryPopup = false;

        const loopFunc = async () => {
          let forceStopPollingVerify = false;
          const forceStop = () => { // 强制停止方法
            if (forceStopPollingVerify !== null && forceStopPollingVerify !== undefined) {
              forceStopPollingVerify = true;
            }

            this.verifyTimerId && clearTimeout(this.verifyTimerId);
          }
          this.forceStopPollingFunc = forceStop;

          const res = await getRaffleApi().catch((res) => res);

          const data = (res || {}).data || {};
          // @ts-ignore
          clearTimeout(this.verifyTimerId);

          if (forceStopPollingVerify) {
            this.forceStopPollingFunc = null;
            resolve({}); // 任何结果都不应再使用，避免因异步影响其他订单的抽奖弹窗

            return;
          };

          // 接口成功且已核销时，重新更新抽奖横幅信息，并结束轮询
          if (res && res.code === 0 && data.is_consumer) {
            this.forceStopPollingFunc = null;
            this.lotteryVerifyTipInfo = data;

            resolve({
              isVerify: true
            });
          } else {
            this.verifyTimerId = setTimeout(() => {
              loopFunc();
            }, timeout);
            this.forceStopPollingFunc = null;
          }
        };

        const resetForce = () => {
          this.forceStopPollingFunc = null;
          clearTimeout(this.verifyTimerId);
          this.verifyTimerId = null;
        }

        // 上次的轮询未结束则先强制结束上一次轮询
        if (this.verifyTimerId) {
          this.forceStopPollingFunc && this.forceStopPollingFunc();
          this.verifyTimerId && clearTimeout(this.verifyTimerId);
        }

        resetForce();
        loopFunc();
      });
    },
            this.pollingVerifyStatus(orderData, 2000).then(async (res) => {
          if (res && res.hasOwnProperty('isVerify')) {
            const meetAcitivityCondition = this.isMeetActivityCondition(sku_m[0], orderData);
            this.showLotteryPopup = meetAcitivityCondition && !this.isEmptyTipInfo && this.lotteryVerifyTipInfo.is_consumer && !this.lotteryVerifyTipInfo.is_lottery;
            orderData.hasShowLotteryPopup = res.isVerify; // 当前订单是否已经弹过弹窗
          }
        });
