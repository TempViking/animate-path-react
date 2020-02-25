import React, {useEffect, useState} from 'react';
import './App.css';
import animatePath from 'animate-path';

function App() {
    const [deg, setDeg] = useState<number | string>(0);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [duration, setDuration] = useState(1000);
    const [points, setPoints] = useState([{x: 0, y: 0}, {x: 500, y: 500}, {x: 300, y: 0}]);
    let canvas = React.createRef<HTMLCanvasElement>();
    let abs_pos = {x: 0, y: 0};
    let iMatrix: number[][] = [[], []];

    useEffect(() => {
        setLeft(canvas.current!.getBoundingClientRect().left + 10);
        setTop(canvas.current!.getBoundingClientRect().top + 10);
    }, []);

    function animateProcess() {
        abs_pos.x = canvas.current!.getBoundingClientRect().left + 10;
        abs_pos.y = canvas.current!.getBoundingClientRect().top + 10;
        const ctx = canvas.current!.getContext('2d');
        ctx!.clearRect(0, 0, 500, 500);
        iMatrix = [[], []];
        animatePath({
            duration: duration,
            points: points,
        }, ({x, y, deg}) => {
            // setDeg(deg);
            // setLeft(x * 100 + abs_pos.x);
            // setTop(y * 100 + abs_pos.y);
            ctx!.fillRect(x - 1, y - 1, 4, 4);
            iMatrix[0].push(x);
            iMatrix[1].push(y);
        }).then(() => {
            // alert('It`s finalized!');
            // window.requestAnimationFrame(function anim() {
            //     rotate(1);
            //     window.requestAnimationFrame(anim);
            // });
        });
    }

    function multMatrix(m1: number[][], m2: number[][]) {
        let rMatrix = new Array(m2.length);
        for (let i = 0; i < m2.length; i++) {
            rMatrix[i] = [];
        }
        for (let r = 0; r < m1[0].length; r++) {
            for (let c = 0; c < m2.length; c++) {
                let sum = 0;
                for (let i = 0; i < m1.length; i++) {
                    sum += m1[i][r] * m2[c][i];
                }
                rMatrix[c].push(sum);
            }
        }
        return rMatrix;
    }

    function rotate(deg:number) {
        const ctx = canvas.current!.getContext('2d');
        ctx!.clearRect(0, 0, 500, 500);
        let rad = deg * Math.PI / 180;
        const rotMatrix = [
            [Math.cos(rad), Math.sin(rad)], // column 1
            [-Math.sin(rad), Math.cos(rad)], // column 2
        ];
        iMatrix = multMatrix(iMatrix, rotMatrix);
        for (let r = 0; r < iMatrix[0].length; r++) {
            ctx!.fillRect(iMatrix[0][r], iMatrix[1][r], 4, 4);
        }
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
            <svg width={30} height={30} viewBox={'0 0 500 500'}
                 style={{transform: `rotate(${deg}deg)`, position: 'absolute', top: top + 'px', left: left + 'px'}}>
                <path
                    d={'M.5,249.5l213-87.5,213-87.5L338.5,287l-88,212.5c0-30-35.4-117.4-88-170C110.92,277.92,30.5,250.5.5,249.5Z'}/>
            </svg>
            <div className={'field'}>
                <span className={'field__desc'}>Points:</span>
                <br/>
                {
                    points.map((el, key) => (
                        <div key={key}>
                            x: <input className={'field__input'} onChange={e => {
                            changePoint(key, {x: parseInt(e.target.value)})
                        }} value={el.x}/>
                            y: <input className={'field__input'} onChange={e => {
                            changePoint(key, {y: parseInt(e.target.value)})
                        }} value={el.y}/>
                            <br/>
                        </div>
                    ))
                }
                <button className={'field__btn'} onClick={addPoint}>+</button>
            </div>
            <div className={'field'}>
                <span className={'field__desc'}>Duration:</span>
                <input className={'field__input'} onChange={e => {
                    setDuration(parseInt(e.target.value));
                }} value={duration}/>
            </div>
            <div>
                <canvas className={'canvas'} width={500} height={500} ref={canvas}></canvas>
            </div>
            <button className={'button'} onClick={() => {rotate(-1)}}>Rotate -1deg</button>
            <button className={'button'} onClick={animateProcess}>Restart</button>
            <button className={'button'} onClick={() => {rotate(1)}}>Rotate +1deg</button>
        </div>
    );
}

export default App;
