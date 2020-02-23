import React, {useEffect, useState} from 'react';
import './App.css';
import animatePath from 'animate-path';

function App() {
    const [deg, setDeg] = useState<number | string>(0);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [duration, setDuration] = useState(1000);
    const [points, setPoints] = useState([{x: 0, y: 0}, {x: 5, y: 5}, {x: 3, y: 0}]);
    let canvas = React.createRef<HTMLCanvasElement>();
    let abs_pos = {x: 0, y: 0};

    useEffect(() => {
        setLeft(canvas.current!.getBoundingClientRect().left + 10);
        setTop(canvas.current!.getBoundingClientRect().top + 10);
    }, []);

    function animateProcess() {
        abs_pos.x = canvas.current!.getBoundingClientRect().left + 10;
        abs_pos.y = canvas.current!.getBoundingClientRect().top + 10;
        const ctx = canvas.current!.getContext('2d');
        ctx!.clearRect(0, 0, 500, 500);
        animatePath({
            duration: duration,
            points: points,
        }, ({x, y, deg}) => {
            setDeg(deg);
            setLeft(x * 100 + abs_pos.x);
            setTop(y * 100 + abs_pos.y);
        }).then(() => {
            // alert('It`s finalized!');
        });
    }

    function changePoint(key: number, val: object) {
        let p = points.slice(0);
        p[key] = {...p[key], ...val};
        setPoints(p);
    }

    function addPoint() {
        if (points.length > 3) {
            alert('Four points already exists!');
            return;
        }
        let p = points.slice(0);
        p.push({x: 0, y: 0});
        setPoints(p);
    }

    return (
        <div className="App">
            <svg width={30} height={30} viewBox={'0 0 500 500'} style={{transform: `rotate(${deg}deg)`, position: 'absolute', top: top + 'px', left: left + 'px'}}>
                <path d={'M.5,249.5l213-87.5,213-87.5L338.5,287l-88,212.5c0-30-35.4-117.4-88-170C110.92,277.92,30.5,250.5.5,249.5Z'} />
            </svg>
            <div className={'field'}>
                <span className={'field__desc'}>Points:</span>
                <br />
                {
                    points.map((el, key) => (
                        <div key={key}>
                            x: <input className={'field__input'} onChange={e => { changePoint(key, {x: parseInt(e.target.value)}) }} value={el.x} />
                            y: <input className={'field__input'} onChange={e => { changePoint(key, {y: parseInt(e.target.value)}) }} value={el.y} />
                            <br />
                        </div>
                    ))
                }
                <button className={'field__btn'} onClick={addPoint}>+</button>
            </div>
            <div className={'field'}>
                <span className={'field__desc'}>Duration:</span>
                <input className={'field__input'} onChange={e => { setDuration(parseInt(e.target.value)); }} value={duration} />
            </div>
            <div>
                <canvas className={'canvas'} width={500} height={500} ref={canvas}></canvas>
            </div>
            <button className={'button'} onClick={animateProcess}>Restart</button>
        </div>
    );
}

export default App;
