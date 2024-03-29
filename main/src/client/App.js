console.log('# App')

import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Col } from 'shards-react';
import routes from '#c/routes';
import store from '#c/functions/store';
import { SaveData } from '#c/functions/index';
import CustomModal from '#c/components/Modal';
const APP = ((props) => {
  console.log(props);
  let {t}=props;
  let { time, cardTime, homePopup } = store.getState().store;


  let now = new Date().getTime(), hours = 1, rrr = false;
  if (time == null) {

    SaveData({ time: new Date().getTime() });

  }
  if (cardTime == null) {
    SaveData({ cardTime: new Date().getTime() });

  }

  console.log('now-time', new Date(now), new Date(time), now - time, hours * 60 * 60 * 10 * 60 * 24);

  if ((now - time) > (hours * 60 * 60 * 10 * 60 * 24)) {
    console.log('sorry, we should show popup!');

    localStorage.removeItem('time');
    localStorage.removeItem('homePopup');
    homePopup = false;
    SaveData({ time: now });

  }
  // console.log('now-cardTime', new Date(now), new Date(cardTime), now - cardTime, 60 * 60 * 10)
  // //
  // if ((now - cardTime) > 60 * 60 * 10) {
  //   console.log('sorry, we should clear card!')
  //   localStorage.removeItem('card');
  //   localStorage.removeItem('cardTime');
  //   SaveData({card: [], cardTime: now});
  //
  // }


  let [width, setValue] = useState(window.innerWidth); // integer state
  // }
  // const { homePopup } = store.getState().store;

  console.log(homePopup);

  if (!homePopup) {
    rrr = true;
    console.log('show popup');
    SaveData({ homePopup: true });


  }
  const [modal, setmodal] = useState(rrr);

  const onCloseModal = () => {
    // let {modals} = this.state;
    setmodal(!modal);

  };

  const renderData = () => {
    console.log('render');
    setValue(window.innerWidth);
  };
  window.addEventListener('resize', () => {
    // width=window.innerWidth;
    if (((width < 1200 && window.innerWidth > 1200))) {
      console.log('resize', width, window.innerWidth);
      width = window.innerWidth;
      renderData();
    }
    if (((width > 1200 && window.innerWidth < 1200))) {
      console.log('resize 2', width, window.innerWidth);
      width = window.innerWidth;
      renderData();
    }

  });
  return (
    <div className={t('languageDir')} dir={t('languageDir')}>
      <BrowserRouter>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              element={<route.layout width={width} {...props}><route.element /></route.layout>}
            />
          ))}
        </Routes>
      </BrowserRouter>
      {/*<CustomModal onClose={() => {*/}
        {/*onCloseModal();*/}
      {/*}} open={false} className={'width50vw sdfghyjuikol kiuytgfhjuyt orangeBack'}*/}
                   {/*title={'بازدیدکنندگان عزیز'}>*/}
        {/*/!*<p style={{textAlign:'center'}}>بازدیدکنندگان عزیز</p>*!/*/}
        {/*<Col><p style={{ textAlign: 'center' }}>*/}
          {/*ضمن عرض تبریک به مناسبت فرا رسیدن سال جدید و آرزوی شادکامی به اطلاع می رسانیم،*/}
          {/*ارسال سفارشات شهرستان تا ۲۴ اسفند و تهران تا ۲۸ اسفند صورت خواهد گرفت. خریدهایی که بعد از این مدت انجام شوند،*/}
          {/*بعد از تعطیلات نوروز در تاریخ ۶ فروردین ارسال خواهند شد.*/}
        {/*</p></Col>*/}
      {/*</CustomModal>*/}
    </div>
  );
});
export default withTranslation()(APP);
