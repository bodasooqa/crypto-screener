import React, { FC, useMemo } from 'react';
import './AddSymbolItem.scss';
import { Exchange } from '../../models/exchange.model';
import { useAppSelector } from '../../hooks';

interface IAddSymbolItemProps {
  exchangeTitle: Exchange;
  symbol: string;
  onClick: (exchange: Exchange, symbol: string) => void;
}

const AddSymbolItem: FC<IAddSymbolItemProps> = ({ exchangeTitle, onClick, symbol }) => {
  const selectedSymbols = useAppSelector(state => state.symbols.selectedSymbols);

  const isDisabled = useMemo(() => {
    return selectedSymbols.some(item => item.symbol === symbol && item.exchange === exchangeTitle);
  }, [selectedSymbols]);

  const handleClick = (exchange: Exchange, symbol: string) => {
    if (!isDisabled) {
      onClick(exchange, symbol);
    }
  };

  return (
    <div
      className={ ['add-symbol-item', isDisabled ? 'add-symbol-item--disabled' : ''].join(' ') }
      onClick={ () => handleClick(exchangeTitle, symbol) }
    >
      { symbol }
    </div>
  );
};

export default AddSymbolItem;
