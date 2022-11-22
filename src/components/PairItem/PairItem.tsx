import React, { FC, useContext, useEffect } from 'react';
import './PairItem.scss';
import { Context } from '../../index';

interface PairItemProps {
  pair: string;
  onClick?: () => void;
}

const PairItem: FC<PairItemProps> = ({ pair }) => {
  const { network } = useContext(Context);

  useEffect(() => {
    network.bybit.getKline(pair, '1m', 20);
  //
  //   const wsClient = new WebSocket(process.env.REACT_APP_BYBIT_WSS as string);
  //
  //   wsClient.addEventListener('open', () => {
  //     console.log('Opened');
  //     wsClient.send(JSON.stringify({
  //       op: 'subscribe',
  //       args: [`kline.1m.${ pair }`],
  //     }));
  //   });
  //
  //   wsClient.addEventListener('message', ({ data }) => {
  //     const parsedData = JSON.parse(data);
  //
  //     if (!!parsedData.data) {
  //       console.log('New message:')
  //       console.log(new Date(parsedData.data.t), '\n');
  //     }
  //   });
  }, []);

  return (
    <div className='pair-item'>
      {pair}
    </div>
  );
};

export default PairItem;
