import {
  IColorConfigType,
  IDataListConfigType,
  IMutiTextConfigType,
  INumberConfigType,
  TColorDefaultType,
  TDataListDefaultType,
  TMutiTextDefaultType,
  TNumberDefaultType,
} from '@/core/FormComponents/types';

export type TTabEditData = Array<
  IMutiTextConfigType | IColorConfigType | INumberConfigType | IDataListConfigType
>;
export interface ITabConfig {
  tabs: TMutiTextDefaultType;
  color: TColorDefaultType;
  activeColor: TColorDefaultType;
  fontSize: TNumberDefaultType;
  imgSize: TNumberDefaultType;
  sourceData: TDataListDefaultType;
}

export interface ITabSchema {
  editData: TTabEditData;
  config: ITabConfig;
}

const Tab: ITabSchema = {
  editData: [
    {
      key: 'tabs',
      name: '项目类别',
      type: 'MutiText',
    },
    {
      key: 'activeColor',
      name: '激活颜色',
      type: 'Color',
    },
    {
      key: 'color',
      name: '文字颜色',
      type: 'Color',
    },
    {
      key: 'fontSize',
      name: '文字大小',
      type: 'Number',
    },
    {
      key: 'imgSize',
      name: '图片大小',
      type: 'Number',
    },
    {
      key: 'sourceData',
      name: '数据源',
      type: 'DataList',
    },
  ],
  config: {
    tabs: ['类别一', '类别二'],
    color: 'rgba(153,153,153,1)',
    activeColor: 'rgba(0,102,204,1)',
    fontSize: 16,
    imgSize: 100,
    sourceData: [
      {
        id: '1',
        title: 'tab1',
        desc: 'tab1',
        link: 'xxxxx',
        type: 0,
        imgUrl: [
          {
            uid: '001',
            name: 'image.png',
            status: 'done',
            url: 'https://i.niupic.com/images/2021/04/29/9gPr.png',
          },
        ],
      },
      {
        id: '2',
        title: 'tab2',
        desc: 'tab2',
        link: 'xxxxx',
        type: 0,
        imgUrl: [
          {
            uid: '001',
            name: 'image.png',
            status: 'done',
            url: 'https://i.niupic.com/images/2021/04/29/9gPs.png',
          },
        ],
      },
      {
        id: '3',
        title: 'tab3',
        desc: 'tab3',
        link: 'xxxxx',
        type: 1,
        imgUrl: [
          {
            uid: '001',
            name: 'image.png',
            status: 'done',
            url: 'https://i.niupic.com/images/2021/04/29/9gPr.png',
          },
        ],
      },
    ],
  },
};

export default Tab;
