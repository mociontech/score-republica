import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [screenActive, setScreenActive] = useState(0);
  const [email, setEmail] = useState('');
  const [points, setPoints] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const sp = new URLSearchParams(window.location.search);
  const admin = sp.get('source')?.toLowerCase() || '';

  const renderScreen = ( ) => {
    switch( screenActive ){
      case 0://screen zero [ OK ]
        return(
          <div className={`screen ${ screenActive === 0 && 'active' } zero`}>
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={email}
              onChange={handleEmail}
              autoFocus={screenActive === 0}
              className='email'
              ref={inputRef}
            />
            <div className='btn-consultar' onClick={handleScore}/>
          </div>
        )
        break;
      case 1://screen one [ OK ]
        return(
          <div className={`screen ${ screenActive === 1 && 'active' } one`}>
            <div className='points'>
              {points} PUNTOS
            </div>
          </div>
        )
        break;
      case 2://screen two [ OK ]
        return(
          <div className={`screen ${ screenActive === 2 && 'active' } two`}>
            <div className='points'>
              {points} PUNTOS
            </div>
            <div className={`btn-reclamar ${admin === '4dm1n' ? 'active' : 'hide'}`} onClick={handleClaim}/>
          </div>
        )
        break;
      case 3://screen three [ OK ]
        return(
          <div className={`screen ${ screenActive === 3 && 'active' } three`}/>
        )
        break;
      default:
        return(<></>);
        break;
    }
  }

  const handleScore = async () => {
    const url = `https://mocionws.info/dbController.php?method=allData&table=view_innovacion_creativa&field=email&value=${email}`;
    await axios.get(url).then(res => {
      const {total, reward} = res.data[0]
      setPoints(total);
      if(total !== "20" && reward === "0")
        setScreenActive(1);
      else if(total === "20" && reward === "0")
        setScreenActive(2);
      else
        setScreenActive(3);
    });
  }
  
  const handleClaim = async() => {
    const url = `https://mocionws.info/dbController.php?method=newRecord&table=rewards&email=${email}`;
    await axios.get(url).then(res => {
      if(res){
        setEmail('');
        setPoints('');
        setScreenActive(0);
      }
    });
  }

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if( value )
      setEmail(value)
    else
      alert("Ingresa un email valido.");
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;

    if (screenActive === 1 || screenActive === 3) {
      timer = setTimeout(() => {
        setEmail('');
        setPoints('');
        setScreenActive(0);
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [screenActive]);

  return (
    <div className="container">{renderScreen()}</div>
  )
}

export default App
