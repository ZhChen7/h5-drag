import {
  IColorConfigType,
  INumberConfigType,
  ITextConfigType,
  IUploadConfigType,
  TColorDefaultType,
  TNumberDefaultType,
  TTextDefaultType,
  TUploadDefaultType,
} from '@/core/FormComponents/types';

export type TQrcodeEditData = Array<
  IUploadConfigType | ITextConfigType | IColorConfigType | INumberConfigType
>;
export interface IQrcodeConfig {
  qrcode: TUploadDefaultType;
  text: TTextDefaultType;
  color: TColorDefaultType;
  fontSize: TNumberDefaultType;
}

export interface IQrcodeSchema {
  editData: TQrcodeEditData;
  config: IQrcodeConfig;
}

const Qrcode: IQrcodeSchema = {
  editData: [
    {
      key: 'qrcode',
      name: '二维码',
      type: 'Upload',
      isCrop: true,
      cropRate: 1,
    },
    {
      key: 'text',
      name: '文字',
      type: 'Text',
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
  ],
  config: {
    qrcode: [
      {
        uid: '001',
        name: 'image.png',
        status: 'done',
        url: 'https://i.niupic.com/images/2021/04/26/9gLD.png',
      },
    ],
    text: '二维码',
    color: 'rgba(153,153,153,1)',
    fontSize: 14,
  },
};

export default Qrcode;
