import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Result, Tabs } from 'antd'; // 蚂蚁ui框架
import {
  PieChartOutlined,
  PlayCircleOutlined,
  HighlightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from '@ant-design/icons'; // 图标库
import { connect } from 'dva'; // 状态库
import { ActionCreators, StateWithHistory } from 'redux-undo';

import HeaderComponent from './components/Header'; // 头部组件
import CanvasControl from './components/CanvasControl'; // 快捷键组件
import SourceBox from './SourceBox'; // middle画布组件
import TargetBox from './TargetBox'; // left物料组件
import Calibration from 'components/Calibration'; // 画布 - 标尺模块

import DynamicEngine, { componentsType } from '@/core/DynamicEngine';
import FormRender from '@/core/FormRender';

import template from 'components/BasicShop/BasicComponents/template'; // 基础组建
import mediaTpl from 'components/BasicShop/MediaComponents/template'; // 媒体组件
import graphTpl from 'components/BasicShop/VisualComponents/template'; // 可视化组件

import schemaH5 from 'components/BasicShop/schema';
import {
  throttle,
  detectMobileBrowser,
  getBrowserNavigatorMetaInfo,
  getQueryString,
} from '@/utils/tool';

import styles from './index.less';

const { TabPane } = Tabs;

const Container = (props: {
  history?: any; //  history路由操作方法
  location?: any; // url字符串query
  pstate?: any; // 刷新后画布中所有组件的状态信息（本地浏览器组件缓存信息）
  cstate?: any;
  dispatch?: any; // redux - 触发
}) => {
  const [scaleNum, setScale] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const [rightColla, setRightColla] = useState(true);
  const [tplName, SetTplName] = useState<string>('');
  const [id, serId] = useState<number>(-1);

  const { pstate, cstate, dispatch } = props;
  const pointData = pstate ? pstate.pointData : [];
  const cpointData = cstate ? cstate.pointData : [];

  useEffect(() => {
    const urlMapObj = getQueryString(window.location.search);
    if (urlMapObj.has('id')) {
      SetTplName(urlMapObj.get('tplname'));
      serId(urlMapObj.get('id'));
    }
  }, [tplName, id]);

  const changeCollapse = useMemo(() => {
    return (c: boolean) => {
      setCollapsed(c);
    };
  }, []);

  const changeRightColla = useMemo(() => {
    return (c: boolean) => {
      setRightColla(c);
    };
  }, []);
  const curPoint = pstate ? pstate.curPoint : {};

  // 指定画布的id
  let canvasId = 'js_canvas';

  const backSize = () => {
    setScale(1);
    setDragState({ x: 0, y: 0 });
  };

  const CpIcon = {
    base: <HighlightOutlined />,
    media: <PlayCircleOutlined />,
    visible: <PieChartOutlined />,
  };

  const generateHeader = useMemo(() => {
    return (type: componentsType, text: string) => {
      return (
        <div>
          {CpIcon[type]} {text}
        </div>
      );
    };
  }, [CpIcon]);

  const handleSlider = useMemo(() => {
    return (type: any) => {
      if (type) {
        setScale((prev: number) => +(prev + 0.1).toFixed(1));
      } else {
        setScale((prev: number) => +(prev - 0.1).toFixed(1));
      }
    };
  }, []);

  const handleFormSave = useMemo(() => {
    return (data: any) => {
      dispatch({
        type: 'editorModal/modPointData',
        payload: { ...curPoint, item: { ...curPoint.item, config: data } },
      });
    };
  }, [curPoint, dispatch]);

  // 清空画布功能
  const clearData = useCallback(() => {
    dispatch({ type: 'editorModal/clearAll' });
  }, [dispatch]);

  const handleDel = useMemo(() => {
    return (id: any) => {
      dispatch({
        type: 'editorModal/delPointData',
        payload: { id },
      });
    };
  }, [dispatch]);

  // 重做功能
  const redohandler = useMemo(() => {
    return () => {
      dispatch(ActionCreators.redo());
    };
  }, [dispatch]);

  // 撤销功能
  const undohandler = useMemo(() => {
    return () => {
      dispatch(ActionCreators.undo());
    };
  }, [dispatch]);

  // 解析并提取excel数据
  const importTpl = (data: any) => {
    dispatch({
      type: 'editorModal/importTplData',
      payload: data,
    });
  };

  // 检测当前浏览器是否处于手机模式下,tip弹窗提醒
  useEffect(() => {
    if (detectMobileBrowser(getBrowserNavigatorMetaInfo())) {
      props.history.push('/mobileTip');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pstate.curPoint && pstate.curPoint.status === 'inToCanvas') {
      setRightColla(false);
    }
  }, [pstate.curPoint]);

  const allType = useMemo(() => {
    let arr: string[] = [];
    template.forEach(v => {
      arr.push(v.type);
    });
    mediaTpl.forEach(v => {
      arr.push(v.type);
    });
    graphTpl.forEach(v => {
      arr.push(v.type);
    });
    return arr;
  }, [graphTpl, mediaTpl, template]);

  const [dragstate, setDragState] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  const renderRight = useMemo(() => {
    return (
      <div
        ref={ref}
        className={styles.attrSetting}
        style={{
          transition: 'all ease-in-out 0.5s',
          transform: rightColla ? 'translate(100%,0)' : 'translate(0,0)',
        }}
      >
        {pointData.length && curPoint ? (
          <>
            <div className={styles.tit}>属性设置</div>
            <FormRender
              config={curPoint.item.editableEl}
              uid={curPoint.id}
              defaultValue={curPoint.item.config}
              onSave={handleFormSave}
              onDel={handleDel}
              rightPannelRef={ref}
            />
          </>
        ) : (
          <div style={{ paddingTop: '100px' }}>
            <Result status="404" title="还没有数据哦" subTitle="赶快拖拽组件来生成你的H5页面吧～" />
          </div>
        )}
      </div>
    );
  }, [cpointData.length, curPoint, handleDel, handleFormSave, pointData.length, rightColla]);

  const tabRender = useMemo(() => {
    if (collapsed) {
      return (
        <>
          <TabPane tab={generateHeader('base', '')} key="1"></TabPane>
          <TabPane tab={generateHeader('media', '')} key="2"></TabPane>
          <TabPane tab={generateHeader('visible', '')} key="3"></TabPane>
        </>
      );
    } else {
      return (
        <>
          <TabPane tab={generateHeader('base', '')} key="1">
            <div className={styles.ctitle}>基础组件</div>
            {template.map((value, i) => {
              return (
                <TargetBox item={value} key={i} canvasId={canvasId}>
                  <DynamicEngine
                    {...value}
                    config={schemaH5[value.type as keyof typeof schemaH5].config}
                    componentsType="base"
                    isTpl={true}
                  />
                </TargetBox>
              );
            })}
          </TabPane>
          <TabPane tab={generateHeader('media', '')} key="2">
            <div className={styles.ctitle}>媒体组件</div>
            {mediaTpl.map((value, i) => (
              <TargetBox item={value} key={i} canvasId={canvasId}>
                <DynamicEngine
                  {...value}
                  config={schemaH5[value.type as keyof typeof schemaH5].config}
                  componentsType="media"
                  isTpl={true}
                />
              </TargetBox>
            ))}
          </TabPane>
          <TabPane tab={generateHeader('visible', '')} key="3">
            <div className={styles.ctitle}>可视化组件</div>
            {graphTpl.map((value, i) => (
              <TargetBox item={value} key={i} canvasId={canvasId}>
                <DynamicEngine
                  {...value}
                  config={schemaH5[value.type as keyof typeof schemaH5].config}
                  componentsType={'visible' as componentsType}
                  isTpl={true}
                />
              </TargetBox>
            ))}
          </TabPane>
        </>
      );
    }
  }, [canvasId, collapsed, generateHeader, graphTpl, mediaTpl, schemaH5, template]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [diffmove, setDiffMove] = useState({
    start: { x: 0, y: 0 },
    move: false,
  });

  const mousedownfn = useMemo(() => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === containerRef.current) {
        setDiffMove({
          start: {
            x: e.clientX,
            y: e.clientY,
          },
          move: true,
        });
      }
    };
  }, []);

  const mousemovefn = useMemo(() => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      if (diffmove.move) {
        let diffx: number;
        let diffy: number;
        const newX = e.clientX;
        const newY = e.clientY;
        diffx = newX - diffmove.start.x;
        diffy = newY - diffmove.start.y;
        setDiffMove({
          start: {
            x: newX,
            y: newY,
          },
          move: true,
        });
        setDragState(prev => {
          return {
            x: prev.x + diffx,
            y: prev.y + diffy,
          };
        });
      }
    };
  }, [diffmove.move, diffmove.start.x, diffmove.start.y]);

  const mouseupfn = useMemo(() => {
    return () => {
      setDiffMove({
        start: { x: 0, y: 0 },
        move: false,
      });
    };
  }, []);

  const onwheelFn = useMemo(() => {
    return (e: React.WheelEvent<HTMLDivElement>) => {
      if (e.deltaY < 0) {
        setDragState(prev => ({
          x: prev.x,
          y: prev.y + 40,
        }));
      } else {
        setDragState(prev => ({
          x: prev.x,
          y: prev.y - 40,
        }));
      }
    };
  }, []);

  useEffect(() => {
    if (diffmove.move && containerRef.current) {
      containerRef.current.style.cursor = 'move';
    } else {
      containerRef.current!.style.cursor = 'default';
    }
  }, [diffmove.move]);

  return (
    <div className={styles.editorWrap}>
      <HeaderComponent
        redohandler={redohandler}
        undohandler={undohandler}
        pointData={pointData}
        clearData={clearData}
        location={props.location}
        importTpl={importTpl}
        tplName={tplName}
        id={id}
      />

      {/* ----------------- */}

      {/*  container  --- 底部三个部分 left、middle、right、righticon*/}
      <div className={styles.container}>
        {/* left -- 物料渲染模块 */}
        <div
          className={styles.list}
          style={{
            transition: 'all ease-in-out 0.5s',
            position: 'fixed',
            width: collapsed ? '50px' : '350px',
            zIndex: 200,
            boxShadow: 'none',
          }}
        >
          <div className={styles.componentList}>
            <Tabs
              className="editorTabclass"
              onTabClick={() => changeCollapse(false)}
              defaultActiveKey="1"
              tabPosition={'left'}
            >
              {tabRender}
            </Tabs>
          </div>
          <div
            className={styles.collapsed}
            style={{ position: 'absolute', bottom: '80px', left: '20px' }}
            onClick={() => changeCollapse(!collapsed)}
          >
            {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          </div>
        </div>
        <div
          style={{
            width: collapsed ? '50px' : '350px',
            transition: 'all ease-in-out 0.5s',
          }}
        ></div>

        {/* middle -- 画布render */}
        <div
          className={styles.tickMark}
          id="calibration"
          ref={containerRef}
          onMouseDown={mousedownfn}
          onMouseMove={throttle(mousemovefn, 500)}
          onMouseUp={mouseupfn}
          onMouseLeave={mouseupfn}
          onWheel={onwheelFn}
        >
          {/* 标尺模块 */}
          <div className={styles.tickMarkTop}>
            <Calibration direction="up" id="calibrationUp" multiple={scaleNum} />
          </div>
          <div className={styles.tickMarkLeft}>
            <Calibration direction="right" id="calibrationRight" multiple={scaleNum} />
          </div>
          <SourceBox
            dragState={dragstate}
            setDragState={setDragState}
            scaleNum={scaleNum}
            canvasId={canvasId}
            allType={allType}
          />
          <CanvasControl scaleNum={scaleNum} handleSlider={handleSlider} backSize={backSize} />
        </div>

        {/* right -- 右侧编辑渲染模块 */}
        {renderRight}

        {/* rightIcon --- 右侧展开按钮模块 */}
        <div
          className={styles.rightcolla}
          style={{
            position: 'absolute',
            right: rightColla ? 0 : '304px',
            transform: 'translate(0,-50%)',
            transition: 'all ease-in-out 0.5s',
          }}
          onClick={() => changeRightColla(!rightColla)}
        >
          {!rightColla ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
        </div>
        <div
          style={{
            width: rightColla ? 0 : '304px',
            transition: 'all ease-in-out 0.5s',
          }}
        ></div>
      </div>
    </div>
  );
};

export default connect((state: StateWithHistory<any>) => {
  return { pstate: state.present.editorModal, cstate: state.present.editorPcModal };
})(Container);
