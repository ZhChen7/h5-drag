import { dynamic } from 'umi';
import Loading from '../components/LoadingCp';
import { useMemo, memo, FC } from 'react';
import React from 'react';

export type componentsType = 'media' | 'base' | 'visible';

const DynamicFunc = (type: string, componentsType: string) => {
  return dynamic({
    loader: async function() {
      let Component: FC<{ isTpl: boolean }>;

      if (componentsType === 'base') {
        const { default: Graph } = await import(`@/components/BasicShop/BasicComponents/${type}`);
        Component = Graph;
      } else if (componentsType === 'media') {
        const { default: Graph } = await import(`@/components/BasicShop/MediaComponents/${type}`);
        Component = Graph;
      } else {
        const { default: Graph } = await import(`@/components/BasicShop/VisualComponents/${type}`);
        Component = Graph;
      }
      return (props: DynamicType) => {
        const { config, isTpl } = props;
        return <Component {...config} isTpl={isTpl} />;
      };
    },
    loading: () => (
      <div style={{ paddingTop: 10, textAlign: 'center' }}>
        <Loading />
      </div>
    ),
  });
};

type DynamicType = {
  isTpl: boolean;
  config: { [key: string]: any };
  type: string;
  componentsType: componentsType;
  category: string;
};
const DynamicEngine = memo((props: DynamicType) => {
  const { type, config, category } = props;
  const Dynamic = useMemo(() => {
    return (DynamicFunc(type, category) as unknown) as FC<DynamicType>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return <Dynamic {...props} />;
});

export default DynamicEngine;
