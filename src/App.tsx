import { useState } from 'react';
import './App.css';
import { getSyncCount, useCount } from './hooks/useCount';

function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className='parent'>
        <AddThreeBox />
        <button onClick={() => setShow(!show)} style={{ alignSelf: 'start' }}>
          Toggle Child
        </button>
        {show && (
          <div className='child-wrapper'>
            <CountBox amount={1} />
            <CountBox amount={-1} />
          </div>
        )}
      </div>
    </>
  );
}

const AddThreeBox = () => {
  const { count, addOne } = useCount();

  return (
    <div className='count-box'>
      <div>
        <span>Count: </span>
        <b>{count}</b>
      </div>
      <button
        onClick={() => {
          addOne();
          addOne();
          addOne();
        }}
      >
        +3
      </button>
    </div>
  );
};

interface CountBoxProps {
  amount: number;
}

const CountBox = ({ amount }: CountBoxProps) => {
  const { count, setCount } = useCount();

  return (
    <div className='count-box'>
      <div>
        <span>Count: </span>
        <b>{count}</b>
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
