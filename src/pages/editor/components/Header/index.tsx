import React, { useRef, memo, useMemo, useState, useEffect } from 'react';
import { Button, Input, Modal, Select, Upload, Tooltip, Badge, message } from 'antd';
import {
  ArrowLeftOutlined,
  MobileOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined,
  FileAddOutlined,
  CodeOutlined,
  SketchOutlined,
  UploadOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';
import req from '@/utils/req';
import Code from '@/assets/weixin.png';
import styles from './index.less';
import MyPopover from 'yh-react-popover';
// import * as axios from 'axios';

const { confirm } = Modal;

const isDev = process.env.NODE_ENV === 'development';

interface HeaderComponentProps {
  pointData: any;
  location: any;
  clearData: any;
  undohandler: any;
  redohandler: any;
  importTpl: any;
  tplName: any;
  id: number;
}

const HeaderComponent = memo((props: HeaderComponentProps) => {
  const {
    pointData,
    location,
    clearData,
    undohandler,
    redohandler,
    importTpl,
    tplName = '',
    id = -1,
  } = props;
  const [showModalIframe, setShowModalIframe] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [faceUrl, setFaceUrl] = useState('');
  const iptRef = useRef<Input>(null);

  const toPreview = () => {
    localStorage.setItem('pointData', JSON.stringify(pointData));
    savePreview();
    setTimeout(() => {
      window.open(
        isDev
          ? `/preview?tid=${props.location.query.tid}`
          : `/preview?tid=${props.location.query.tid}`,
      );
    }, 600);
  };

  const toOnlineCoding = () => {
    window.open('/ide');
  };

  const toVipLogin = () => {
    window.open('/login');
  };

  const content = () => {
    const { tid } = location.query || '';
    return (
      <QRCode value={`${window.location.protocol}//${window.location.host}/preview?tid=${tid}`} />
    );
  };

  const generateFace = (num: number) => {
    console.log(num);
  };

  const handleSaveTpl = () => {
    const InputDOM =
      tplName === '' ? (
        <Input ref={iptRef} allowClear />
      ) : (
        <Input ref={iptRef} disabled value={`${tplName}`} />
      );

    confirm({
      title: '?????????????????????',
      content: (
        <div className={styles.saveForm}>
          <div className={styles.formIpt}>
            <span>???????????????</span>
            {InputDOM}
          </div>
          <div className={styles.formIpt}>
            <span>???????????????</span>
            <Button
              type="primary"
              size="small"
              style={{ marginRight: '20px' }}
              onClick={() => generateFace(1)}
            >
              ??????????????????
            </Button>
            <Button size="small" onClick={() => generateFace(0)}>
              ??????????????????
            </Button>
          </div>
          <div className={styles.formIpt}>
            <span>???????????????</span>
            <Input disabled value="???????????????????????????????????????" />
          </div>
        </div>
      ),
      okText: '??????',
      cancelText: '??????',
      onOk() {
        let name = iptRef.current!.state.value;
        let templateData: any;
        if (id && id > 0) {
          // edit??????
          templateData = {
            id,
            name,
            pointData: JSON.stringify(pointData),
          };
          req.post('/api/fixtpldata', templateData).then(res => {
            if (res.data && res.data.err_code === 0) {
              message.success('????????????????????????????????????');
              setTimeout(() => {
                history.push('/list');
              }, 1000);
            } else {
              message.error('???????????????????????????????????????????????????');
            }
          });
        } else {
          // ??????tpl
          templateData = {
            name,
            pointData: JSON.stringify(pointData),
          };
          req.post('/api/saveTemplate', templateData).then(res => {
            if (res.data && res.data.err_code === 0) {
              message.success('????????????????????????????????????');
              setTimeout(() => {
                history.push('/list');
              }, 1000);
            } else {
              message.error('???????????????????????????????????????????????????');
            }
          });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const useTemplate = () => {
    Modal.info({
      title: '?????????????????????????????????????????????????????????????????????',
      content: (
        <div style={{ textAlign: 'center' }}>
          <img src={Code} alt="????????????" style={{ width: '180px' }} />
        </div>
      ),
      okText: '???????????????',
    });
  };

  const downLoadJson = () => {
    const jsonStr = JSON.stringify(pointData);
    const blob = new Blob([jsonStr], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'template.json');
  };

  const toLogin = () => {
    const { tid } = props.location.query || '';
    window.location.href = `/h5_plus/login?tid=${tid}`;
  };

  const deleteAll = () => {
    Modal.confirm({
      title: '???????????????????',
      okText: '??????',
      cancelText: '??????',
      onOk() {
        clearData();
      },
    });
  };

  const toHelp = () => {
    window.open('/help');
  };

  const toBack = () => {
    history.push('/');
  };

  const newPage = () => {
    let prev = localStorage.getItem('myH5');
    try {
      localStorage.setItem(
        'myH5',
        JSON.stringify(prev ? [...Array.from(prev), pointData] : [pointData]),
      );
    } catch (err) {
      console.error(err);
    }
    clearData();
  };

  const savePreview = () => {
    const { tid } = props.location.query || '';
    req.post('/visible/preview', { tid, tpl: pointData });
  };

  const handleSaveCode = () => {
    Modal.confirm({
      title: '???????????????JSON??????????',
      okText: '??????',
      cancelText: '??????',
      onOk() {
        downLoadJson();
      },
    });
  };

  useEffect(() => {
    // ?????????????????????????????????
    window.getFaceUrl = url => {
      setFaceUrl(url);
      setShowModalIframe(false);
    };
  }, []);

  const uploadprops = useMemo(
    () => ({
      name: 'file',
      showUploadList: false,
      beforeUpload(file, fileList) {
        // ???????????????excel??????
        let reader = new FileReader();
        reader.onload = function(e: Event) {
          let data = (e as any).target.result;
          importTpl && importTpl(JSON.parse(data));
        };
        reader.readAsText(file);
      },
    }),
    [],
  );

  const generatePoster = () => {
    localStorage.setItem('pointData', JSON.stringify(pointData));
    setShowModalIframe(true);
    setTimeout(() => {
      setShowFaceModal(true);
    }, 3600);
  };

  const handleReloadPage = () => {
    document.getElementById('previewPage')?.contentWindow.location.reload();
  };

  return (
    <div className={styles.header}>
      <div className={styles.logoArea}>
        <div className={styles.backBtn} onClick={toBack}>
          <ArrowLeftOutlined />
        </div>
        <div className={styles.logo}></div>
      </div>
      <div className={styles.controlArea}>
        {/* <Button type="primary" style={{ marginRight: '9px' }} onClick={useTemplate}>
          ?????????
        </Button> */}
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          onClick={handleSaveTpl}
          disabled={!pointData.length}
        >
          ????????????
        </Button>
        <Upload {...uploadprops}>
          <Button type="link" style={{ marginRight: '8px' }}>
            <UploadOutlined />
          </Button>
        </Upload>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          onClick={handleSaveCode}
          disabled={!pointData.length}
        >
          <DownloadOutlined />
        </Button>
        {/* <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="??????json??????"
          onClick={downLoadJson}
          disabled={!pointData.length}
        >
          <CopyOutlined />
        </Button> */}
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="????????????"
          onClick={newPage}
          disabled={!pointData.length}
        >
          <FileAddOutlined />
        </Button>
        {/* <MyPopover content={content()} directions="BOTTOM">
          <Button
            type="link"
            style={{ marginRight: '9px' }}
            onClick={savePreview}
            disabled={!pointData.length}
          >
            <MobileOutlined />
          </Button>
        </MyPopover> */}
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="??????"
          onClick={deleteAll}
          disabled={!pointData.length}
        >
          <DeleteOutlined />
        </Button>
        <Button
          type="link"
          style={{ marginRight: '9px' }}
          title="??????"
          onClick={undohandler}
          disabled={!pointData.length}
        >
          <UndoOutlined />
        </Button>
        {/* <Button type="link" style={{ marginRight: '9px' }} title="??????" onClick={redohandler}>
          <RedoOutlined />
        </Button> */}
        <Tooltip placement="bottom" title="???????????????????????????">
          <Badge dot offset={[-18, 10]}>
            <Button
              type="link"
              style={{ marginRight: '6px' }}
              onClick={generatePoster}
              disabled={!pointData.length}
            >
              <InstagramOutlined />
            </Button>
          </Badge>
        </Tooltip>
        <Button type="link" onClick={toPreview} disabled={!pointData.length}>
          ??????
        </Button>
      </div>
      <div className={styles.btnArea}>
        {/* ??????pc?????????, ?????????????????? */}
        {/* <Select
          defaultValue="h5"
          style={{ width: 100, marginRight: 20 }}
          onChange={e => {
            setTheme(e);
          }}
        >
          <Select.Option value="h5">h5??????</Select.Option>
          <Select.Option value="pc">pc??????</Select.Option>
        </Select> */}
        {/* <Button type="primary" ghost onClick={toVipLogin} style={{ marginRight: '12px' }}>
          <SketchOutlined />
          ????????????
        </Button> */}
      </div>
      {/* ?????????iframe */}
      <Modal
        title="???????????????...(??????????????????????????????????????????)"
        visible={showModalIframe}
        footer={null}
        width={414}
        closeIcon={<RedoOutlined />}
        destroyOnClose={true}
        onCancel={handleReloadPage}
        maskClosable={false}
      >
        <iframe
          id="previewPage"
          src={`/preview?tid=${props.location.query.tid}&gf=1`}
          style={{ width: '100%', border: 'none', height: '600px' }}
        ></iframe>
      </Modal>
      <Modal
        title="?????????(??????????????????)"
        visible={showFaceModal}
        footer={null}
        width={414}
        destroyOnClose={true}
        onCancel={() => setShowFaceModal(false)}
      >
        <img src={faceUrl} style={{ width: '100%' }} />
      </Modal>
    </div>
  );
});

export default HeaderComponent;
