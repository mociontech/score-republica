import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [screenActive, setScreenActive] = useState(0);
  const [email, setEmail] = useState("");
  const [points, setPoints] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const sp = new URLSearchParams(window.location.search);
  const admin = sp.get("source")?.toLowerCase() || "";

  const renderScreen = () => {
    switch (screenActive) {
      case 0: //screen zero [ OK ]
        return (
          <div
            className={`screen ${
              screenActive === 0 && "active"
            } zero h-screen w-screen flex flex-col justify-center py-6 px-4`}
          >
            <img
              src="/humano.svg"
              alt="logo-humano"
              className="h-10 md:mt-20"
            />
            <div className="flex flex-col mt-20 justify-center items-center">
              <img
                src="/Nombre-Evento 1.png"
                alt="Dia de innovacion logo"
                className=" mb-10 md:mb-20"
              />
              <img src="/hola.svg" alt="saludo" className="h-10" />
              <p className="text-white text-center text-[28px] md:text-[38px] max-w-[600px] mb-10">
                Ingresa tu correo electrónico para consultar tu puntaje.
              </p>
              <div className="relative flex flex-col">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo"
                  value={email}
                  onChange={handleEmail}
                  autoFocus={screenActive === 0}
                  className="font-normal flex flex-1 w-auto text-white/50 bg-white/15 rounded-lg md:rounded-3xl
                  border-[1.5px] border-white pl-14 py-3 text-[20px] md:text-[38px] md:pl-24"
                  ref={inputRef}
                />
                <img
                  src="/email.svg"
                  alt="email icon"
                  className="absolute top-[18px] left-5 md:left-8 h-5 md:h-10 md:top-6"
                />
              </div>
              <button
                className="button-text flex text-center bg-[#06ADBF] items-center justify-center text-[24px] 
                h-[60px] text-white rounded-[20px] px-10 mt-10 md:text-[48px] md:py-12"
                onClick={handleScore}
              >
                Consultar
              </button>
            </div>
          </div>
        );
        break;
      case 1: //screen one [ OK ]
        return (
          <div
            className={`${
              screenActive === 1 && "active"
            } flex flex-col h-screen w-screen justify-center items-center gap-10`}
          >
            <img src="/rocket.svg" alt="" className="h-[150px] md:h-[250px]" />
            <img src="/sigue-asi.svg" alt="" className="px-14" />
            <div className="points text-white px-6 py-2 md:py-3 border-[1.5px] rounded-[24px] text-[30px] md:text-[60px] border-white bg-white/15">
              {points} PUNTOS
            </div>
            <p className="text-white px-10 text-center text-[20px] md:text-[38px] max-w-[600px] mb-10">
              Canjea tu premio reuniendo más de 20 puntos.{" "}
              <strong>Sigue participando.</strong>
            </p>
            <img src="/humano.svg" alt="" className="h-6 md:h-10" />
          </div>
        );
        break;
      case 2: //screen two [ OK ]
        return (
          <div
            className={`${
              screenActive === 2 && "active"
            } flex flex-col h-screen w-screen justify-center items-center gap-5`}
          >
            <img src="/rocket.svg" alt="" className="h-[150px] md:h-[250px]" />
            <img src="/felicitaciones.svg" alt="" className="px-14" />
            <div className="points text-white px-6 py-2 md:py-3 border-[1.5px] rounded-[24px] text-[30px] md:text-[60px] border-white bg-white/15">
              {points} PUNTOS
            </div>
            <p className="text-white px-10 text-center text-[20px] md:text-[38px] max-w-[600px] mb-10">
              ¡Ya puedes reclamar tu premio!{" "}
              <strong>Gracias por participar.</strong>
            </p>
            {admin && (
              <button className="reclamar text-white flex text-[30px] md:text-[38px] bg-[#06ADBF] w-1/2 rounded-lg text-center justify-center items-center mb-10" onClick={handleClaim}>
                Reclamar
              </button>
            )}
            <img src="/humano.svg" alt="" className="h-6 md:h-10" />
          </div>
        );
        break;
      case 3: //screen three [ OK ]
        return (
          <div
            className={`${
              screenActive === 3 && "active"
            } flex flex-col h-screen w-screen justify-center items-center gap-5`}
          >
            <img src="/rocket.svg" alt="" className="h-[150px] md:h-[250px]" />
            <img src="/felicitaciones.svg" alt="" className="px-14" />
            <p className="text-white px-10 text-center text-[20px] md:text-[38px] max-w-[600px] my-10">
              ¡Ya has reclamado tu premio!{" "}
              <strong>Gracias por participar.</strong>
            </p>
            <img src="/humano.svg" alt="" className="h-6 md:h-10" />
          </div>
        );
        break;
      default:
        return <></>;
        break;
    }
  };

  const handleScore = async () => {
    if (email === "") return alert("Ingresa un email valido.");
    const url = `https://mocionws.info/dbController.php?method=allData&table=view_innovacion_creativa&field=email&value=${email}`;
    await axios.get(url).then((res) => {
      if (res.data.length) {
        const { total, reward } = res.data[0];
        setPoints(total);
        if (total !== "20" && reward === "0") setScreenActive(1);
        else if (total === "20" && reward === "0") setScreenActive(2);
        else setScreenActive(3);
      } else alert("Email no registrado, valida el email ingresado.");
    });
  };

  const handleClaim = async () => {
    const url = `https://mocionws.info/dbController.php?method=newRecord&table=rewards&email=${email}`;
    await axios.get(url).then((res) => {
      if (res) {
        setEmail("");
        setPoints("");
        setScreenActive(0);
      }
    });
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;

    if (screenActive === 1 || screenActive === 3) {
      timer = setTimeout(() => {
        setEmail("");
        setPoints("");
        setScreenActive(0);
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [screenActive]);

  return <div className="container">{renderScreen()}</div>;
}

export default App;
