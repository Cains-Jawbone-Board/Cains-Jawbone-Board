import React from "react"

const dotEndingRadius = 3
const strokeWidth = 1
const arrowHeadEndingSize = 10 
const boundingBoxElementsBuffer = strokeWidth + arrowHeadEndingSize;

const MAX_Y_CONTROL_POINT_SHIFT = 50;
const STRAIGHT_LINE_BEFORE_ARROW_HEAD = 5;

function calculateDeltas(startPoint, endPoint) {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    return {
        dx, dy, absDx, absDy
    }
}

function calculateFixedLineInflectionConstant(absDx, absDy) {
    const WEIGHT_X = 4;
    const WEIGHT_Y = 0.8;

    return Math.round(Math.sqrt(absDx) * WEIGHT_X + Math.sqrt(absDy) * WEIGHT_Y);
}

function calculateLowDyControlPointShift(dx, dy, maxShift = MAX_Y_CONTROL_POINT_SHIFT) {
    if (dx > 0) return 0;
    const sign = dy < 0 ? -1 : 1;
    const value = Math.round(
        maxShift * Math.pow(0.9, Math.pow(1.2, Math.abs(dy) / 10)),
    );

    // prevent negative zero
    if (value === 0) return 0;

    return sign * value;
}

function calculateControlPoints({absDx, absDy, dx, dy}) {
    let startPointX = 0;
    let startPointY = 0;
    let endPointX = absDx;
    let endPointY = absDy;
    if (dx < 0) [startPointX, endPointX] = [endPointX, startPointX];
    if (dy < 0) [startPointY, endPointY] = [endPointY, startPointY];

    const fixedLineInflectionConstant = calculateFixedLineInflectionConstant(
        absDx,
        absDy,
    );
    const lowDyYShift = calculateLowDyControlPointShift(dx, dy);

    const p1 = {
        x: startPointX,
        y: startPointY,
    };
    const p2 = {
        x: startPointX + fixedLineInflectionConstant,
        y: startPointY + lowDyYShift
    };
    const p3 = {
        x: endPointX - fixedLineInflectionConstant,
        y: endPointY - lowDyYShift
    };
    const p4 = {
        x: endPointX,
        y: endPointY,
    };

    return { p1, p2, p3, p4 };
}

function calculateControlPointsWithBuffer({boundingBoxElementsBuffer, absDx, absDy, dx, dy}) {
    const { p1, p2, p3, p4 } = calculateControlPoints({
        absDx,
        absDy,
        dx,
        dy,
    });
    
    const topBorder = Math.min(p1.y, p2.y, p3.y, p4.y);
    const bottomBorder = Math.max(p1.y, p2.y, p3.y, p4.y);
    const leftBorder = Math.min(p1.x, p2.x, p3.x, p4.x);
    const rightBorder = Math.max(p1.x, p2.x, p3.x, p4.x);

    const verticalBuffer = (bottomBorder - topBorder - absDy) / 2 + boundingBoxElementsBuffer;
    const horizontalBuffer = (rightBorder - leftBorder - absDx) / 2 + boundingBoxElementsBuffer;

    const boundingBoxBuffer = {
        vertical: verticalBuffer,
        horizontal: horizontalBuffer,
    };
    
    return {
        p1: {
          x: p1.x + horizontalBuffer,
          y: p1.y + verticalBuffer,
        },
        p2: {
          x: p2.x + horizontalBuffer,
          y: p2.y + verticalBuffer,
        },
        p3: {
          x: p3.x + horizontalBuffer,
          y: p3.y + verticalBuffer,
        },
        p4: {
          x: p4.x + horizontalBuffer,
          y: p4.y + verticalBuffer,
        },
        boundingBoxBuffer,
    };
}

function calculateCanvasDimensions({absDx, absDy, boundingBoxBuffer}) {
    const canvasWidth = absDx + 2 * boundingBoxBuffer.horizontal;
    const canvasHeight = absDy + 2 * boundingBoxBuffer.vertical;

    return { canvasWidth, canvasHeight };
}

export default class Arrow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startPoint: props.startPoint,
            endPoint: props.endPoint,
        };
    }

    updatePoint(startPoint, endPoint) {
        this.setState({
            startPoint: startPoint,
            endPoint: endPoint,
        });
    }

    render() {
        const { absDx, absDy, dx, dy } = calculateDeltas(this.state.startPoint, this.state.endPoint);
    
        const { p1, p2, p3, p4, boundingBoxBuffer } = calculateControlPointsWithBuffer({
            boundingBoxElementsBuffer,
            dx,
            dy,
            absDx,
            absDy,
          });
        
        const { canvasWidth, canvasHeight } = calculateCanvasDimensions({
            absDx,
            absDy,
            boundingBoxBuffer,
        });
          
        const canvasXOffset = Math.min(this.state.startPoint.x, this.state.endPoint.x) - boundingBoxBuffer.horizontal;
        const canvasYOffset = Math.min(this.state.startPoint.y, this.state.endPoint.y) - boundingBoxBuffer.vertical;
    
        return (
            <svg
                width={canvasWidth}
                height={canvasHeight}
                style={{ 
                    position: "absolute",
                    backgroundColor:"transparent",
                    transform: `translate(${canvasXOffset}px, ${canvasYOffset}px)`,
                    zIndex: '-1'
                }}
            >
                <path 
                    stroke="black"
                    strokeWidth={strokeWidth}
                    fill="none"
                    d={`
                        M ${p1.x}, ${p1.y} 
                        C ${p2.x}, ${p2.y} 
                        ${p3.x}, ${p3.y} 
                        ${p4.x - STRAIGHT_LINE_BEFORE_ARROW_HEAD}, ${p4.y} 
                        L ${p4.x} ${p4.y}`
                    } 
                />
                <path
                    d={`
                        M ${(arrowHeadEndingSize / 5) * 2} 0
                        L ${arrowHeadEndingSize} ${arrowHeadEndingSize / 2}
                        L ${(arrowHeadEndingSize / 5) * 2} ${arrowHeadEndingSize}`
                    }
                    fill="none"
                    stroke="black"
                    style={{ transform: `translate(${p4.x - arrowHeadEndingSize}px, ${p4.y - arrowHeadEndingSize / 2}px)`}}
                />
                <circle
                    cx={p1.x}
                    cy={p1.y}
                    r={dotEndingRadius}
                    stroke="black"
                    strokeWidth={1}
                    fill="white"
                />
            </svg>
        )
    }
}
