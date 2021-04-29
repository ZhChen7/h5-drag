import {
  ITextConfigType,
  IUploadConfigType,
  TTextDefaultType,
  TUploadDefaultType,
} from '@/core/FormComponents/types';

export type TVideoEditData = Array<IUploadConfigType | ITextConfigType>;
export interface IVideoConfig {
  poster: TUploadDefaultType;
  url: TTextDefaultType;
}

export interface IVideoSchema {
  editData: TVideoEditData;
  config: IVideoConfig;
}

const Video: IVideoSchema = {
  editData: [
    {
      key: 'poster',
      name: '视频封面',
      type: 'Upload',
    },
    {
      key: 'url',
      name: '视频链接',
      type: 'Text',
    },
  ],
  config: {
    poster: [
      {
        uid: '001',
        name: 'image.png',
        status: 'done',
        url: 'https://i.niupic.com/images/2021/04/29/9gPr.png',
      },
    ],
    url: '',
  },
};

export default Video;
