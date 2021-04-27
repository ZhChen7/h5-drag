import React from 'react';
import { history } from 'umi';
import { MobileOutlined } from '@ant-design/icons';

import styles from './index.less';

const Home = () => {
  const handleGo = (type: string) => {
    if (type === 'H5') {
      history.push('/editor?tid=123456');
    }
  };
  return (
    <div className={styles.homeWrap}>
      <div className={styles.contentArea}>
        <div className={styles.operation}>
          <div className={styles.card} onClick={() => handleGo('H5')}>
            <MobileOutlined />
            <div>制作H5页面</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
