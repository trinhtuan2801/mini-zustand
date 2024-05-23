import { useState } from 'react';
import './App.css';
import { getSyncCount, useCount } from './hooks/useCount';

function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className='parent'>
        <button onClick={() => setShow(!show)}>Toggle</button>
        <div className='child-wrapper'>
          {show && (
            <>
              <Child amount={1} />
              <Child amount={-1} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

interface ChildProps {
  amount: number;
}

const Child = ({ amount }: ChildProps) => {
  const { count, setCount } = useCount();

  return (
    <div className='child'>
      <div>
        <b>Active Index: </b>
        {count}
      </div>
      <button
        onClick={() => {
          setCount(count + amount);

          console.log('react state', count);
          console.log('sync state', getSyncCount().count);
        }}
      >
        {amount > 0 ? '+' : ''}
        {amount}
      </button>
    </div>
  );
};

export default App;
