import React, { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Card, Avatar, Breadcrumb } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';
import req from '@/utils/req';
import { connect } from 'dva';
import { StateWithHistory } from 'redux-undo';
import './index.less';

const { Meta } = Card;

export interface ITplviewProps {
  history?: any; //  history路由操作方法
  location?: any; // url字符串query
  pstate?: any; // 刷新后画布中所有组件的状态信息（本地浏览器组件缓存信息）
  cstate?: any;
  dispatch?: any; // redux - 触发
}

interface tplState {
  id: number;
  tplname: string;
  tplstrdata: string;
  user: string;
}

const Tplview = (props: ITplviewProps) => {
  const [tplListArr, setTplListArr] = useState<Array<tplState> | []>([]);
  const { dispatch } = props;

  // 清空画布功能
  const clearData = useCallback(() => {
    dispatch({ type: 'editorModal/clearAll' });
  }, [dispatch]);

  const importTpl = (data: any) => {
    dispatch({
      type: 'editorModal/importTplData',
      payload: data,
    });
  };

  useEffect(() => {
    req.get('/api/getTplAllData').then(res => {
      if (res.data && res.data.err_code === 0) {
        setTplListArr(res.data.result);
      }
    });
  }, []);

  const cardHandleClick = async (item: tplState) => {
    await clearData();
    await importTpl(JSON.parse(item.tplstrdata));

    console.log('item', item);
    history.push({
      pathname: '/editor',
      query: {
        id: `${item.id}`,
        tplname: `${item.tplname}`,
      },
    });
  };

  const renderList = tplListArr.map((item: tplState) => {
    return (
      <Card
        hoverable
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
        key={item.id}
        onClick={() => cardHandleClick(item)}
      >
        <Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={`模版名称：${item.tplname}`}
          description={`id序号：${item.id}`}
        />
      </Card>
    );
  });

  return (
    <div className="Tplview">
      <div className="header">
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/list">
            <span>模版列表</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="list">
        <ul className="ul">{renderList}</ul>
      </div>
    </div>
  );
};

export default connect((state: StateWithHistory<any>) => {
  return { pstate: state.present.editorModal, cstate: state.present.editorPcModal };
})(Tplview);
