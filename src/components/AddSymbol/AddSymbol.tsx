import React, { ChangeEvent, FC, useMemo, useState } from 'react';
import './AddSymbol.scss';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AppInput from '../UI/AppInput/AppInput';
import { useSymbols } from '../../hooks/useSymbols';
import { Exchange } from '../../models/exchange.model';
import AddSymbolItem from '../AddSymbolItem/AddSymbolItem';

const AddSymbol: FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [search, setSearch] = useState('');

  const { availableExchangesSymbols, addSymbol } = useSymbols();

  const symbolsToSelect = useMemo(() => {
    return availableExchangesSymbols.map((obj) => ({
      ...obj,
      symbols: obj.symbols
        .filter(symbol => symbol.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 20)
    }));
  }, [search, availableExchangesSymbols]);

  const setFormActive = () => {
    if (!isActive) {
      setIsActive(true);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
  };

  const getExchange = (exchange: Exchange) => {
    return exchange.split('-');
  };

  const getExchangeTitle = (exchange: Exchange) => {
    return getExchange(exchange)[0].toUpperCase();
  };

  const getExchangeType = (exchange: Exchange) => {
    return getExchange(exchange)[1][0].toUpperCase();
  };

  const handleClick = (exchange: Exchange, symbol: string) => {
    addSymbol({ exchange, symbol });
    setIsActive(false);
    setSearch('');
  };

  return (
    <div
      className={ ['add-symbol', isActive ? 'add-symbol--active' : ''].join(' ') }
      onClick={ setFormActive }
    >
      { isActive
        ? <div className='add-symbol__form'>
          <AppInput
            placeholder='Symbol'
            type='text'
            value={ search }
            onChange={ handleChange }
          />
          <div className="add-symbol__content">
            { !!search
              ? symbolsToSelect.map(exchange =>
                <div className='add-symbol__symbol-list' key={ `exchange-${ exchange.title }` }>
                  <span className='add-symbol__symbol-list__title'>
                    <span className="add-symbol__symbol-list__type">
                      { getExchangeType(exchange.title) }
                    </span>
                    { getExchangeTitle(exchange.title) }
                  </span>
                  { exchange.symbols.map(symbol =>
                    <AddSymbolItem
                      key={ `symbol-${ exchange.title }-${ symbol }` }
                      exchangeTitle={ exchange.title } symbol={ symbol } onClick={ handleClick }
                    />
                  ) }
                </div>
              )
              : 'No results' }
          </div>
        </div>
        : <FontAwesomeIcon icon={ faPlus } /> }
    </div>
  );
};

export default AddSymbol;
