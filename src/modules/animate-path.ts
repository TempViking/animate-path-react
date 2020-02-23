const requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    (<any>window).mozRequestAnimationFrame ||
    (<any>window).oRequestAnimationFrame ||
    (<any>window).msRequestAnimationFrame ||
    function (callback: () => void) {
        window.setTimeout(callback, 1000 / 60);
    };

interface ICalculate {
    (t: number, points: IPoint[]): IPoint,
}

interface IPoint {
    x: number,
    y: number,
}

interface IAlignedPoint extends IPoint {
    tg: IPoint,
}

function derive(points: IPoint[]) {
    let dpoints = [];
    for (let p = points, d = p.length, c = d - 1; d > 1; d--, c--) {
        let list = [];
        for (let j = 0, dpt; j < c; j++) {
            dpt = {
                x: c * (p[j + 1].x - p[j].x),
                y: c * (p[j + 1].y - p[j].y)
            };
            list.push(dpt);
        }
        dpoints.push(list);
        p = list;
    }
    return dpoints;
}

function getTGForTwo(points: IPoint[], t: number) {
    let mt = 1 - t,
        a = mt * mt,
        b = mt * t * 2;
    return {
        x: a * points[0].x + b * points[1].x,
        y: a * points[0].y + b * points[1].y,
    };
}

function getTGForThree(points: IPoint[], t: number) {
    let mt = 1 - t,
        a = mt * mt,
        b = mt * t * 2,
        c = t * t;
    return {
        x: a * points[0].x + b * points[1].x + c * points[2].x,
        y: a * points[0].y + b * points[1].y + c * points[2].y,
    };
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

export default async function ({duration, points}: IAnimatePath, func: (p: IAlignedPoint) => void) {
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
                let point = calculate(timeFraction, points);
                let tg = {x: 0, y: 0};
                if (points.length > 3) {
                    tg = getTGForThree(derive(points)[0], timeFraction);
                } else if(points.length > 2) {
                    tg = getTGForTwo(derive(points)[0], timeFraction);
                }
                let m = Math.sqrt(tg.x*tg.x + tg.y*tg.y);
                tg = {x:tg.x/m, y:tg.y/m};
                func({...point, tg: tg});
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        });
    });
}
