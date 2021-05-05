import React, { useCallback } from 'react';
import { history } from 'umi';
import { MobileOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const Home = (props: { dispatch: any }) => {
  const { dispatch } = props;

  const handleGo = async (type: string) => {
    const randomNum = Math.random()
      .toString()
      .slice(-6);
    await clearData();
    if (type === 'H5') {
      history.push(`/editor?tid=${randomNum}`);
    }
  };

  // 清空画布功能
  const clearData = useCallback(() => {
    dispatch({ type: 'editorModal/clearAll' });
  }, [dispatch]);

  const jumpListPage = () => {
    history.push('/list');
  };

  return (
    <div className={styles.homeWrap}>
      <div className={styles.btn}>
        <Button type="dashed" size="large" onClick={() => jumpListPage()}>
          查看模版列表
        </Button>
      </div>

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

export default connect()(Home);
