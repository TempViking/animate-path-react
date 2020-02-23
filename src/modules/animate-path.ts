const requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    (<any>window).mozRequestAnimationFrame ||
    (<any>window).oRequestAnimationFrame ||
    (<any>window).msRequestAnimationFrame ||
    function (callback: () => void) {
        window.setTimeout(callback, 1000 / 60);
    };

interface ICalculate {
    (t: number, points: IPoint[]): IPoint
}

interface IPoint {
    x: number,
    y: number,
}

function calculateTwoPoints(t: number, [p1, p2]: IPoint[]) {
    return {
        x: (1 - t) * p1.x + t * p2.x,
        y: (1 - t) * p1.y + t * p2.y,
    };
}

function calculateThreePoints(t: number, [p1, p2, p3]: IPoint[]) {
    return {
        x: (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * p2.x + t * t * p3.x,
        y: (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * p2.y + t * t * p3.y,
    };
}

function calculateFourPoints(t: number, [p1, p2, p3, p4]: IPoint[]) {
    function calculate(type: 'x' | 'y') {
        return Math.pow(1 - t, 3) * p1[type] +
            3 * Math.pow(1 - t, 2) * t * p2[type] +
            3 * (1 - t) * Math.pow(t, 2) * p3[type] +
            Math.pow(t, 3) * p4[type];
    }

    return {
        x: calculate('x'),
        y: calculate('y'),
    };
}

interface IAnimatePath {
    duration: number,
    points: IPoint[],
}

export default async function({duration, points}: IAnimatePath, func: (p: IPoint) => void) {
    let time_start = performance.now();

    let calculate: ICalculate;

    switch (points.length) {
        case 3:
            calculate = calculateThreePoints;
            break;
        case 4:
            calculate = calculateFourPoints;
            break;
        default:
            calculate = calculateTwoPoints;
    }

    await new Promise(resolve => {
        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - time_start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            if (timeFraction < 1) {
                func(calculate(timeFraction, points));
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        });
    });
}
