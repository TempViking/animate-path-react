import React, {useEffect, useState} from 'react';
import './App.css';
import animatePath from './modules/animate-path';

function App() {
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [duration, setDuration] = useState(400);
    const [points, setPoints] = useState([{x: 0, y: 0}, {x: 5, y: 5}]);
    let canvas = React.createRef<HTMLCanvasElement>();

    function animateProcess() {
        const ctx = canvas.current!.getContext('2d');
        ctx!.clearRect(0, 0, 500, 500);
        animatePath({
            duration: duration,
            points: points,
        }, ({x, y, tg}) => {
            // ctx!.fillRect(x * 10, y * 10, 1, 1);
            ctx!.beginPath();
            ctx!.moveTo(x * 100, y * 100);
            ctx!.lineTo(x * 100 + tg.x * 10, y * 100 + tg.y * 10);
            ctx!.closePath();
            ctx!.stroke();
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
            <div style={{
                left: left + 'px',
                top: top + 'px',
            }}>
                <canvas className={'canvas'} width={500} height={500} ref={canvas}></canvas>
            </div>
            <button className={'button'} onClick={animateProcess}>Restart</button>
        </div>
    );
}

export default App;
